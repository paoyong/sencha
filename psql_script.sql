DROP DATABASE IF EXISTS pyramus;
CREATE DATABASE pyramus;
\connect pyramus;

DROP TABLE IF EXISTS subpy;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS upvoted;
DROP TABLE IF EXISTS subscribed_to;

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
    posts_score     integer,
    comment_score   integer,
    creation_time   timestamptz NOT NULL default now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS post (
    id              bigserial,
    author          varchar(100)
        REFERENCES users(username)
        ON UPDATE CASCADE ON DELETE CASCADE,
    title           text NOT NULL,
    url             text,
    self_text       text,
    score           integer,
    subpy           varchar(50) NOT NULL
        REFERENCES subpy(name)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    creation_time   timestamptz NOT NULL default now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS upvoted (
    user_id         integer
        REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    post_id         bigint
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
        ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (user_id, subpy)
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
