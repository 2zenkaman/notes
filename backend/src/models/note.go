package models

import (
	"fmt"
	"strings"
	"time"
)

type Tag struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateNoteRequest struct {
	Title   string   `json:"title"`
	Content string   `json:"content"`
	Hidden  bool     `json:"hidden"`
	Tags    []string `json:"tags"`
}

type Note struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UserID    string    `json:"user_id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Hidden    bool      `json:"hidden"`
	Tags      []Tag     `json:"tags"`
}

func (n *CreateNoteRequest) Insert(user_id string) (*Note, error) {
	if DB == nil {
		return nil, fmt.Errorf("DB is nil")
	}

	note := Note{
		Title:   n.Title,
		Content: n.Content,
		Hidden:  n.Hidden,
		Tags:    []Tag{},
	}

	err := DB.QueryRow(`
		INSERT INTO notes (title, content, hidden, user_id)
		VALUES (?, ?, ?, ?)
		RETURNING note_id, created_at;`,
		n.Title, n.Content, n.Hidden, user_id,
	).Scan(&note.ID, &note.CreatedAt)

	if err != nil {
		return nil, err
	}

	for _, t := range n.Tags {
		var tagID string
		query := `
			INSERT INTO tags (name)
			VALUES (?)
			ON CONFLICT(name) DO UPDATE 
			SET name = EXCLUDED.name
			RETURNING tag_id;`
		DB.QueryRow(query, t).Scan(&tagID)

		if err != nil {
			return nil, err
		}

		_, err = DB.Exec(`
			INSERT INTO note_tags (note_id, tag_id)
			VALUES (?, ?)
			ON CONFLICT(note_id, tag_id) DO NOTHING;`,
			note.ID, tagID,
		)

		if err != nil {
			return nil, err
		}

		note.Tags = append(note.Tags, Tag{ID: tagID, Name: t})
	}

	return &note, nil
}

func GetNoteTags(id string) ([]Tag, error) {
	if DB == nil {
		return nil, fmt.Errorf("DB is nil")
	}

	query := `SELECT t.name, t.tag_id FROM tags AS t
		JOIN note_tags AS nt ON t.tag_id = nt.tag_id
		WHERE nt.note_id = ?;`

	rows, err := DB.Query(query, id)
	if err != nil {
		return nil, err
	}

	tags := make([]Tag, 0)

	for rows.Next() {
		var tag Tag
		if err := rows.Scan(&tag.Name, &tag.ID); err != nil {
			return nil, err
		}

		tags = append(tags, tag)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tags, nil
}

func GetNote(id string) (*Note, error) {
	query := `SELECT * FROM notes WHERE note_id = ?;`

	var note Note
	err := DB.QueryRow(query, id).
		Scan(&note.ID, &note.CreatedAt, &note.Title, &note.Content, &note.Hidden)

	if err != nil {
		return nil, err
	}

	tags, err := GetNoteTags(id)
	if err != nil {
		return nil, err
	}

	note.Tags = tags

	return &note, nil
}

func GetAllNotes(filters map[string]string, userID string) ([]Note, error) {
	if DB == nil {
		return nil, fmt.Errorf("DB is nil")
	}

	query := `SELECT * FROM notes`
	filters["user_id = ?"] = userID

	conds := make([]string, 0)
	args := make([]any, 0)

	for k, v := range filters {
		conds = append(conds, k)
		args = append(args, v)
	}
	query += " WHERE " + strings.Join(conds, " AND ") + ";"

	fmt.Println(query, args)

	rows, err := DB.Query(query, args...)
	if err != nil {
		return nil, err
	}

	notes := make([]Note, 0)
	for rows.Next() {
		var n Note
		if err := rows.Scan(&n.ID, &n.CreatedAt, &n.Title, &n.Content, &n.Hidden, &n.UserID); err != nil {
			return nil, err
		}

		tags, err := GetNoteTags(n.ID)
		if err != nil {
			return nil, err
		}

		n.Tags = tags
		notes = append(notes, n)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return notes, nil
}

func DeleteNote(id string) error {
	query := `DELETE FROM notes WHERE note_id = ?;`

	_, err := DB.Exec(query, id)

	return err
}

// func PatchNote(id string, patches map[string]any) (*Note, error) {
// if len(patches) == 0 {
// 	return nil, fmt.Errorf("no patches provided")
// }

// query := "UPDATE notes SET "

// setters := make([]string, 0)
// for column, value := range patches {
// 	fmt.Println(reflect.TypeOf(value))
// 	setstr := fmt.Sprintf("%v = %v", column, value)
// 	setters = append(setters, setstr)
// }

// query += strings.Join(setters, ", ") + " WHERE note_id = " + id + ";"

// fmt.Println(query)

// _, err := DB.Exec(query)

// if err != nil {
// 	return nil, err
// 	// }

// 	return GetNote(id)
// }
