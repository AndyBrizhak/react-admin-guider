// src/components/LoginPage.jsx
import React, { useState } from "react";
import {
  useLogin,
  useNotify,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
} from "react-admin";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const FormContainer = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to bottom right, #2196F3, #21CBF3)",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 300,
  maxWidth: 400,
  width: "100%",
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
}));

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    login({ username, password })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError("Неверное имя пользователя или пароль");
        notify(
          "Ошибка входа: " + (error?.message || "Проверьте учетные данные"),
          { type: "error" },
        );
      });
  };

  return (
    <FormContainer>
      <StyledCard>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Вход в систему
            </Typography>

            {error && (
              <Box sx={{ mb: 2, color: "error.main" }}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Имя пользователя"
                source="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
                disabled={loading}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Пароль"
                source="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                disabled={loading}
              />
            </Box>
          </CardContent>

          <CardActions sx={{ flexDirection: "column" }}>
            <StyledButton
              variant="contained"
              type="submit"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Выполняется вход..." : "Войти"}
            </StyledButton>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Typography color="primary">
                  Нет учетной записи? Зарегистрироваться
                </Typography>
              </Link>
            </Box>
          </CardActions>
        </form>
      </StyledCard>
    </FormContainer>
  );
};

export default LoginPage;
