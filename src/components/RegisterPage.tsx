// src/components/RegisterPage.jsx
import React, { useState } from "react";
import {
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
import { useNavigate } from "react-router-dom";
import authProvider from "../authProvider";

const FormContainer = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to bottom right, #4CAF50, #8BC34A)",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 300,
  maxWidth: 500,
  width: "100%",
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
}));

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const notify = useNotify();
  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return false;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать не менее 6 символов");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Используем метод register из authProvider
    authProvider
      .register({
        username,
        email,
        password,
        role: "user", // По умолчанию регистрируем как обычного пользователя
      })
      .then(() => {
        notify("Регистрация успешна! Теперь вы можете войти");
        navigate("/login");
      })
      .catch((error) => {
        notify(`Ошибка регистрации: ${error.message || "Неизвестная ошибка"}`, {
          type: "error",
        });
      });
  };

  return (
    <FormContainer>
      <StyledCard>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Регистрация
            </Typography>

            {error && (
              <Box sx={{ mb: 2, color: "error.main" }}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Подтвердите пароль"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
              />
            </Box>
          </CardContent>

          <CardActions sx={{ flexDirection: "column" }}>
            <StyledButton
              variant="contained"
              type="submit"
              color="primary"
              fullWidth
            >
              Зарегистрироваться
            </StyledButton>

            <Button sx={{ mt: 1 }} onClick={() => navigate("/login")} fullWidth>
              No need
            </Button>
          </CardActions>
        </form>
      </StyledCard>
    </FormContainer>
  );
};

export default RegisterPage;
