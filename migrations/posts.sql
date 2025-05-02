-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_likes INTEGER DEFAULT 0 CHECK (total_likes >= 0),
    total_dislikes INTEGER DEFAULT 0 CHECK (total_dislikes >= 0),
    total_comments INTEGER DEFAULT 0 CHECK (total_comments >= 0),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -- Increment on insert
-- CREATE TRIGGER IF NOT EXISTS increment_like_count AFTER INSERT ON post_likes BEGIN
-- UPDATE posts
-- SET total_likes = total_likes + 1
-- WHERE id = NEW.post_id;
-- END;

-- -- Decrement on delete
-- CREATE TRIGGER IF NOT EXISTS decrement_like_count AFTER DELETE ON post_likes BEGIN
-- UPDATE posts
-- SET total_likes = total_likes - 1
-- WHERE id = OLD.post_id;
-- END;

-- -- Create post_likes table
-- CREATE TABLE IF NOT EXISTS post_likes (
--     user_id INTEGER NOT NULL,
--     post_id INTEGER NOT NULL,
--     PRIMARY KEY (user_id, post_id),
--     FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
--     FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
-- );

-- -- Create post_dislikes table
-- CREATE TABLE IF NOT EXISTS post_dislikes (
--     user_id INTEGER NOT NULL,
--     post_id INTEGER NOT NULL,
--     PRIMARY KEY (user_id, post_id),
--     FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
--     FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
-- );

-- -- Create comments table
-- CREATE TABLE IF NOT EXISTS comments (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL,
--     post_id INTEGER NOT NULL,
--     content TEXT NOT NULL,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
--     FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
-- );

-- -- Create categories table
-- CREATE TABLE IF NOT EXISTS categories (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL UNIQUE
-- );

-- -- Create post_categories table
-- CREATE TABLE IF NOT EXISTS post_categories (
--     post_id INTEGER,
--     category_id INTEGER,
--     PRIMARY KEY (post_id, category_id),
--     FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
--     FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
-- );
