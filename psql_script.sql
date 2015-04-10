DROP DATABASE IF EXISTS pyramus;
CREATE DATABASE pyramus;
\connect pyramus;

DROP TABLE IF EXISTS subpy;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS upvoted;
DROP TABLE IF EXISTS subscribed_to;

CREATE TABLE IF NOT EXISTS subpy (
    id              SERIAL,
    name            VARCHAR(50) NOT NULL UNIQUE,
    creation_time   TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL,
    username        VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(100) NOT NULL,
    posts_score     INTEGER,
    comment_score   INTEGER,
    creation_time   TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS post (
    id              BIGSERIAL,
    author          VARCHAR(100) NOT NULL,
    title           TEXT NOT NULL,
    url             TEXT,
    self_text       TEXT,
    score           INTEGER,
    subpy           VARCHAR(50) NOT NULL,
    creation_time   TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (author) REFERENCES users(username)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    FOREIGN KEY (subpy) REFERENCES subpy(name)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS upvoted (
    user_id         INTEGER REFERENCES users(id)
    ON DELETE cascade ON UPDATE cascade,
    post_id         BIGINT REFERENCES post(id)
    ON DELETE cascade ON UPDATE cascade,
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS subscribed_to (
    user_id         INTEGER NOT NULL,
    subpy           VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (subpy) REFERENCES subpy(name)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (user_id, subpy)
);

-- On INSERT INTO upvoted, we want to increment user post karma
CREATE OR REPLACE FUNCTION post_upvote_update_scores() RETURNS TRIGGER AS
$$
    DECLARE
        post_author integer;
    BEGIN
        -- We want to increment the score for the person that made the post, not the person who gave away the upvote. So we want to increment for the post author.
        SELECT post.author INTO STRICT post_author FROM post
            WHERE post.id = NEW.post_id;

        -- Increment post author's post_score on upvote
        UPDATE users
            SET posts_score = posts_core + 1
            WHERE username = post_author;
    END;
$$ language plpgsql;

CREATE TRIGGER upvote_insert
    AFTER INSERT ON upvoted
    FOR EACH ROW
    EXECUTE PROCEDURE post_upvote_update_scores(user_id, post_id);
