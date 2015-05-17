DROP DATABASE IF EXISTS pyramus;
CREATE DATABASE pyramus;
\connect pyramus;

DROP TABLE IF EXISTS upvoted CASCADE;
DROP TABLE IF EXISTS subscribed_to CASCADE;
DROP TABLE IF EXISTS comment_upvoted CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS post CASCADE;
DROP TABLE IF EXISTS subpy CASCADE;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE IF NOT EXISTS subpy (
    id              serial,
    name            varchar(50) NOT NULL UNIQUE,
    creation_time   timestamptz NOT NULL default now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
    id              serial,
    username        varchar(100) NOT NULL UNIQUE,
    password        varchar(100) NOT NULL,
    posts_score     integer NOT NULL default 0,
    comments_score  integer NOT NULL default 0,
    creation_time   timestamptz NOT NULL default now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS post (
    id              bigserial,
    author          varchar(100)
        REFERENCES users(username)
        ON UPDATE CASCADE ON DELETE CASCADE,
    title           text NOT NULL,
    -- Null URL means it is a text post
    url             text,
    self_text       text,
    score           integer NOT NULL default 0,
    subpy           varchar(50) NOT NULL
        REFERENCES subpy(name)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    creation_time   timestamptz NOT NULL default now(),
    comment_count   integer NOT NULL default 0,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS upvoted (
    user_id         integer NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    post_id         bigint NOT NULL
        REFERENCES post(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS subscribed_to (
    user_id         integer NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    subpy           varchar(50) NOT NULL
        REFERENCES subpy(name)
        ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (user_id, subpy)
);

-- Schema copied and adapted from
-- http://cramer.io/2010/05/30/scaling-threaded-comments-on-django-at-disqus/
CREATE TABLE IF NOT EXISTS comments (
    id              bigserial,
    message         text,
    author          varchar(100)
        REFERENCES users(username)
        ON DELETE NO ACTION ON UPDATE CASCADE,
    score           integer NOT NULL default 0,
    creation_time   timestamptz default now(),
    post_id         bigint NOT NULL
        REFERENCES post(id)
        ON DELETE CASCADE ON UPDATE NO ACTION,
    parent_id       integer
        REFERENCES comments(id),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS comment_upvoted (
    user_id         integer NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    comment_id      bigint NOT NULL
        REFERENCES comments(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (user_id, comment_id)
);


-- TRIGGER FUNCTIONS

-- On INSERT INTO upvoted, we want to increment user
-- total score and also post score. Vice versa for DELETE.
CREATE OR REPLACE FUNCTION post_upvote_update_scores() RETURNS TRIGGER AS
$$
    DECLARE
        post_author varchar(100);
    BEGIN
        -- We want to update the score for the person that
        -- made the post, not the person who gave away the
        -- upvote. So we want to increment for the post author.
        IF TG_OP = 'INSERT' THEN
            SELECT author INTO STRICT post_author FROM post
                WHERE id = NEW.post_id;
            UPDATE users
                SET posts_score = posts_score + 1
                WHERE username = post_author;
            UPDATE post
                SET score = score + 1
                WHERE id = NEW.post_id;
            RETURN NEW;
        ELSIF TG_OP = 'DELETE' THEN
            SELECT author INTO STRICT post_author FROM post
                WHERE id = OLD.post_id;
            UPDATE users
                SET posts_score = posts_score - 1
                WHERE username = post_author;
            UPDATE post
                SET score = score - 1
                WHERE id = OLD.post_id;
            RETURN OLD;
        END IF;
    END;
$$ language plpgsql;

CREATE TRIGGER upvote_insert
    AFTER INSERT OR DELETE ON upvoted
    FOR EACH ROW
    EXECUTE PROCEDURE post_upvote_update_scores();

CREATE OR REPLACE FUNCTION comment_upvote_update_scores() RETURNS TRIGGER AS
$$
    DECLARE
        comment_author varchar(100);
    BEGIN
        IF TG_OP = 'INSERT' THEN
            SELECT author INTO STRICT comment_author FROM comments
                WHERE id = NEW.comment_id;
            UPDATE users
                SET comments_score = comments_score + 1
                WHERE username = comment_author;
            UPDATE comments
                SET score = score + 1
                WHERE id = NEW.comment_id;
            RETURN NEW;
        ELSIF TG_OP = 'DELETE' THEN
            SELECT author INTO STRICT comment_author FROM comments
                WHERE id = OLD.comment_id;
            UPDATE users
                SET comments_score = comments_score - 1
                WHERE username = comment_author;
            UPDATE comments
                SET score = score - 1
                WHERE id = OLD.comment_id;
            RETURN OLD;
        END IF;
    END;
$$ language plpgsql;

CREATE TRIGGER comment_upvote_insert
    AFTER INSERT OR DELETE ON comment_upvoted
    FOR EACH ROW
    EXECUTE PROCEDURE comment_upvote_update_scores();

CREATE OR REPLACE FUNCTION on_add_delete_comment() RETURNS TRIGGER AS
$$
    DECLARE
        user_id integer;
    BEGIN
        IF TG_OP = 'INSERT' THEN
            -- On comment insert, we want to increment the post's
            -- comment count, and also upvote the same comment.
            SELECT id INTO STRICT user_id FROM users
                WHERE username=NEW.author;
            INSERT INTO comment_upvoted VALUES (user_id, NEW.id);
            -- Increment post comment count
            UPDATE post
                SET comment_count = comment_count + 1
                WHERE post.id = NEW.post_id;
            RETURN NEW;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE post
                SET comment_count = comment_count - 1
                WHERE post.id = OLD.post_id;
            RETURN OLD;
        END IF;
    END;
$$ language plpgsql;

CREATE TRIGGER comment_insert
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW
    EXECUTE PROCEDURE on_add_delete_comment();
