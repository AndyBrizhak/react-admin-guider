// src/authProvider.tsx
import { AuthProvider } from "react-admin";

const apiUrl = process.env.REACT_APP_API_URL || "https://localhost:7078/api";

// Типы для параметров авторизации
interface LoginParams {
  username: string;
  password: string;
}

interface RegisterParams {
  username: string;
  email: string;
  password: string;
  role?: string;
}

// Интерфейс для ответа авторизации
interface AuthResponse {
  token: string;
  id: string;
  username: string;
  role: string;
  isSuccess?: boolean;
  message?: string;
}

// Тип ошибки для функции checkError
interface HttpError {
  status: number;
  message?: string;
}

// Определение разрешений на основе роли
type Permission = "admin" | "users" | "all" | "limited" | "basic";

// Интерфейс для идентификации пользователя
interface UserIdentity {
  id: string;
  fullName: string;
  role: string | null;
}

export const authProvider: AuthProvider = {
  // Логин
  login: ({ username, password }: LoginParams) => {
    const request = new Request(`${apiUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          // Попробуем получить сообщение об ошибке в формате JSON
          return response
            .json()
            .then((errorData: { message?: string }) => {
              throw new Error(
                errorData.message ||
                  response.statusText ||
                  "Ошибка аутентификации",
              );
            })
            .catch((error) => {
              // Если не удалось распарсить JSON, просто возвращаем общую ошибку
              throw new Error(response.statusText || "Ошибка аутентификации");
            });
        }
        return response.json() as Promise<AuthResponse>;
      })
      .then((auth: AuthResponse) => {
        // Проверяем наличие необходимых данных
        if (!auth || !auth.token) {
          throw new Error(
            "Сервер вернул неверный формат данных аутентификации",
          );
        }

        // Сохраняем данные пользователя
        localStorage.setItem("token", auth.token);
        localStorage.setItem("userId", auth.id);
        localStorage.setItem("username", auth.username);
        localStorage.setItem("role", auth.role); // важно для разрешений
        return auth;
      });
  },

  // Регистрация
  register: ({ username, email, password, role = "user" }: RegisterParams) => {
    const request = new Request(`${apiUrl}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ username, email, password, role }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          return response
            .json()
            .then((errorData: { message?: string }) => {
              throw new Error(errorData.message || "Ошибка регистрации");
            })
            .catch(() => {
              throw new Error(
                "Ошибка регистрации: " +
                  (response.statusText || "Неизвестная ошибка"),
              );
            });
        }
        return response.json() as Promise<AuthResponse>;
      })
      .then((result: AuthResponse) => {
        if (!result || !result.isSuccess) {
          throw new Error(
            result?.message || "Неизвестная ошибка при регистрации",
          );
        }
        return result;
      });
  },

  // Выход из системы
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    return Promise.resolve();
  },

  // Проверка аутентификации
  checkAuth: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject({ message: "Необходима аутентификация" });
    }

    // Можно добавить проверку срока действия токена
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationDate = new Date(payload.exp * 1000);

      if (expirationDate < new Date()) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        return Promise.reject({ message: "Срок действия сессии истек" });
      }
    } catch (e) {
      // Если не удалось проверить срок действия, считаем токен действительным
    }

    return Promise.resolve();
  },

  // Получение разрешений пользователя
  getPermissions: () => {
    const role = localStorage.getItem("role");
    if (!role) {
      return Promise.reject({ message: "Роль не определена" });
    }

    // Определяем разрешения на основе роли
    let permissions: Permission[] = [];
    switch (role) {
      case "superadmin":
        permissions = ["admin", "users", "all"];
        break;
      case "admin":
        permissions = ["admin", "users", "limited"];
        break;
      case "manager":
        permissions = ["limited"];
        break;
      default:
        permissions = ["basic"];
    }

    return Promise.resolve(permissions);
  },

  // Получение информации о пользователе
  getIdentity: () => {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (!userId || !username) {
      return Promise.reject({
        message: "Информация о пользователе не найдена",
      });
    }

    return Promise.resolve({
      id: userId,
      fullName: username,
      role: role,
    } as UserIdentity);
  },

  // Проверка типа ошибки
  checkError: (error: HttpError) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      return Promise.reject({
        message: "Требуется повторная аутентификация",
        redirectTo: "/login",
      });
    }
    return Promise.resolve();
  },
};

export default authProvider;
