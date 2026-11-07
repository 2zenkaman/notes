package shared

import (
	"fmt"
	"net/http"
	"notes/models"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var signingMethod = jwt.SigningMethodHS256

var key []byte

func LoadJWTKey(envkey string) error {
	k := os.Getenv(envkey)
	if k == "" {
		return fmt.Errorf("jwt token is absent in .env or is an empty string")
	}
	key = []byte(k)
	return nil
}

type Claims struct {
	UserID string `json:"user_id,omitempty"`
	Login  string `json:"login,omitempty"`
	jwt.RegisteredClaims
}

func GenerateAccessToken(user *models.User) *jwt.Token {
	return jwt.NewWithClaims(signingMethod, Claims{
		UserID: user.ID,
		Login:  user.Login,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(10 * time.Minute)),
		},
	})
}

func GenerateRefreshToken(user *models.User) *jwt.Token {
	return jwt.NewWithClaims(signingMethod, Claims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * 24 * time.Hour)),
		},
	})
}

func TokenCookie(token *jwt.Token, name string, path string) (*http.Cookie, error) {
	s, err := token.SignedString(key)
	if err != nil {
		return nil, err
	}

	exp, err := token.Claims.GetExpirationTime()
	if err != nil {
		return nil, err
	}

	return &http.Cookie{
		Name:     name,
		Value:    s,
		MaxAge:   int(time.Until(exp.Time).Seconds()),
		HttpOnly: true,
		Path:     path,
	}, nil
}

func VerifyToken(token string) (*jwt.Token, error) {
	return jwt.Parse(token, func(t *jwt.Token) (any, error) {
		return key, nil
	}, jwt.WithValidMethods([]string{"HS256"}))
}
