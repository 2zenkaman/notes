package models

import (
	"errors"
	"fmt"
)

var ErrNilDB = errors.New("DB is nil")

var ErrUserConflict = errors.New("User already exists")

type LoginRequest struct {
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
}

type RegisterRequest struct {
	Login string `json:"login" form:"login"`
	LoginRequest
}

type User struct {
	ID string `json:"id" form:"id"`
	RegisterRequest
}

type UserResponse struct {
	UserID string `json:"user_id,omitempty"`
	Login  string `json:"login,omitempty"`
}

func (req LoginRequest) GetUser() (*User, error) {
	if DB == nil {
		return nil, ErrNilDB
	}

	query := `SELECT user_id, login FROM users WHERE email = ? AND password = ?;`
	fmt.Println(req.Email, req.Password)

	user := &User{
		LoginRequest: req,
	}

	err := DB.QueryRow(query, req.Email, req.Password).Scan(&user.ID, &user.Login)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (req RegisterRequest) Insert() (*User, error) {
	if DB == nil {
		return nil, ErrNilDB
	}

	user := &User{
		RegisterRequest: req,
	}

	query := `INSERT INTO users (email, login, password) VALUES (?, ?, ?) RETURNING user_id;`

	err := DB.QueryRow(query, req.Email, req.Login, req.Password).Scan(&user.ID)
	if err != nil {
		return nil, ErrUserConflict
	}

	return user, nil
}
