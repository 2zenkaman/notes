package models

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

const dsn = "notes.db"

var DB *sql.DB

func OpenDB() (err error) {
	DB, err = sql.Open("sqlite3", dsn)
	if err != nil {
		return err
	}

	DB.Exec(`PRAGMA foreign_keys = ON;`)

	_, err = DB.Exec(`
		CREATE TABLE IF NOT EXISTS notes (
			note_id INTEGER PRIMARY KEY,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			title TEXT NOT NULL,
			content TEXT,
			hidden SMALLINT NOT NULL,
			user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS note_tags (
			note_id INTEGER NOT NULL REFERENCES notes(note_id) ON UPDATE CASCADE,
			tag_id INTEGER NOT NULL REFERENCES tags(tag_id) ON UPDATE CASCADE,
			PRIMARY KEY (note_id, tag_id)
		);
		
		CREATE TABLE IF NOT EXISTS tags (
			tag_id INTEGER PRIMARY KEY,
			name TEXT NOT NULL UNIQUE
		);

		CREATE TABLE IF NOT EXISTS users (
			user_id INTEGER PRIMARY KEY,
			email TEXT NOT NULL UNIQUE,
			login TEXT NOT NULL,
			password TEXT NOT NULL
		);
	`)

	return err
}
