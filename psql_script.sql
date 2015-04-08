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
    name            VARCHAR(50) NOT NULL UNIQUE,
    creation_time   timestamptz NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
    id              serial,
    username        VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(100) NOT NULL,
    posts_score     integer,
    comment_score   integer,
    creation_time   timestamptz NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS post (
    id              bigserial,
    author          VARCHAR(100) NOT NULL,
    title           TEXT NOT NULL,
    url             TEXT,
    self_text       TEXT,
    score           integer,
    subpy           VARCHAR(50) NOT NULL,
    creation_time   timestamptz NOT NULL,
    FOREIGN KEY (author) REFERENCES users(username)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    FOREIGN KEY (subpy) REFERENCES subpy(name)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS upvoted (
    user_id         integer references users(id),
    post_id         bigint references post(id),
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
