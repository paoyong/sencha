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
    posts_score     integer NOT NULL default 0,
    comment_score   integer NOT NULL default 0,
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
    creation_time   timestamptz default now(),
    post_id         bigint NOT NULL
        REFERENCES post(id)
        ON DELETE CASCADE ON UPDATE NO ACTION,
    parent_id       INTEGER
        REFERENCES comments(id),
    PRIMARY KEY (id)
);

/* -- Comment Thread query */
/* CREATE OR REPLACE FUNCTION get_comments(integer) RETURNS setof record AS */
/* $$ */
/* BEGIN */
/*     WITH RECURSIVE cte (id, message, author, creation_time, post_id, path, parent_id, depth)  AS ( */
/*         SELECT  id, */
/*             message, */
/*             author, */
/*             creation_time, */
/*             post_id, */
/*             array[id] AS path, */
/*             parent_id, */
/*             1 AS depth */
/*         FROM    comments */
/*         WHERE   parent_id IS NULL */

/*         UNION ALL */

/*         SELECT  comments.id, */
/*             comments.message, */
/*             comments.author, */
/*             comments.creation_time, */
/*             comments.post_id, */
/*             cte.path || comments.id, */
/*             comments.parent_id, */
/*             cte.depth + 1 AS depth */
/*         FROM    comments */
/*         JOIN cte ON comments.parent_id = cte.id */
/*         ) */
/*         SELECT id, message, author, now() - creation_time as age, path, depth FROM cte WHERE post_id=$1 */
/*     ORDER BY path; */
/* END; */
/* $$ language 'plpgsql'; */

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
