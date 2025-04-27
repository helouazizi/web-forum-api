CREATE TABLE posts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER,
	title TEXT,
	content TEXT,
	created_at DATETIME,
	updated_at DATETIME,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
