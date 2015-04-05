DROP DATABASE IF EXISTS pyramus;
CREATE DATABASE pyramus;
\connect pyramus;

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id              serial,
    username        VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(100) NOT NULL,
    posts_score     integer,
    comment_score   integer,
    creation_time   timestamptz,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS post (
    id              bigserial,
    author          VARCHAR(100),
    title           TEXT,
    self_text       TEXT,
    subpy           VARCHAR(50),
    creation_time   timestamptz,
    FOREIGN KEY (author) REFERENCES users(username)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    FOREIGN KEY (subpy) REFERENCES subpy(name)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS subscribed_to (
    user_id         INTEGER,
    subpy           INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (subpy) REFERENCES subpy(name)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    PRIMARY KEY (user_id, subpy)
);

CREATE TABLE IF NOT EXISTS subpy (
    id              serial,
    name            VARCHAR(50) NOT NULL UNIQUE,
    creation_time   timestamptz,
    PRIMARY KEY (id)
);
