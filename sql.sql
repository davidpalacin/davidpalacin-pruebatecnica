CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL
);

INSERT INTO users (name, email, password, role) VALUES
  ("admin", "admin@admin.com", "password", "admin"),
  ("john", "john@admin.com", "password", "user"),
  ("jane", "jane@admin.com", "password", "user"),
  ("bob", "bob@admin.com", "password", "user");
