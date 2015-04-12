\connect pyramus

-- Create sample data for testing
INSERT INTO subpy VALUES (default, 'dota2', default);
INSERT INTO subpy VALUES (default, 'music', default);
INSERT INTO subpy VALUES (default, 'funny', default);

DELETE FROM comments;
INSERT INTO comments VALUES (default, 'Hello world', 'keithy', default, default, 1, null);
INSERT INTO comments VALUES (default, 'Hello myself', 'keithy', default, default, 1, 1);
INSERT INTO comments VALUES (default, 'Hello hello myself', 'keithy', default, default, 1, 2);

DELETE FROM comment_upvoted;
-- Upvote comments 1 and 3
INSERT INTO comment_upvoted VALUES (1, 1);
INSERT INTO comment_upvoted VALUES (1, 3);
