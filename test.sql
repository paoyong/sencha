DROP DATABASE IF EXISTS test;
CREATE DATABASE test;
\connect test;

CREATE TABLE IF NOT EXISTS post (
    id              bigserial,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
    id              serial,
    PRIMARY KEY (id)
);

DELETE FROM upvoted;
DROP TABLE upvoted;
CREATE TABLE IF NOT EXISTS upvoted (
    user_id         integer
        REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    post_id         bigint
        REFERENCES post(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (user_id, post_id)
);

-- Create three posts
INSERT INTO post VALUES (default);
INSERT INTO post VALUES (default);
INSERT INTO post VALUES (default);

-- Create two users
INSERT INTO users VALUES (default);
INSERT INTO users VALUES (default);

-- User 1 upvotes Post 1, and so on
INSERT INTO upvoted VALUES (1, 1);
INSERT INTO upvoted VALUES (2, 1);
INSERT INTO upvoted VALUES (3, 2);

-- Pretend I am logged into User 2
SELECT DISTINCT ON (post.id) post.id as postid,
    CASE WHEN user_id=1 THEN true ELSE false END as user_upvoted
    FROM post LEFT OUTER JOIN upvoted
    ON post_id = post.id
    ORDER BY post.id, user_upvoted DESC;
