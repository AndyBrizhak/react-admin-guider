// src/authProvider.js
// Note: This is an enhancement to your existing authProvider

const apiUrl = process.env.REACT_APP_API_URL || "https://your-api-url.com/api";

export const authProvider = {
  // Login method (assuming it's already implemented correctly)
  login: ({ username, password }) => {
    const request = new Request(`${apiUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((auth) => {
        // Store user data including token and role
        localStorage.setItem("token", auth.token);
        localStorage.setItem("userId", auth.id);
        localStorage.setItem("username", auth.username);
        localStorage.setItem("role", auth.role); // important for permissions
        return auth;
      });
  },

  // Register method (assuming it's already implemented correctly)
  register: ({ username, email, password, role }) => {
    const request = new Request(`${apiUrl}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ username, email, password, role }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return fetch(request).then((response) => {
      if (response.status < 200 || response.status >= 300) {
        return response.json().then((error) => {
          throw new Error(error.message || "Registration failed");
        });
      }
      return response.json();
    });
  },

  // Logout method
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    return Promise.resolve();
  },

  // Check authentication status
  checkAuth: () => {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  },

  // Get user's permissions based on their role
  getPermissions: () => {
    const role = localStorage.getItem("role");
    if (!role) {
      return Promise.reject("No role found");
    }

    // Define permissions based on role
    let permissions;
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

  // Get user identity
  getIdentity: () => {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    if (!userId || !username) {
      return Promise.reject("No identity found");
    }

    return Promise.resolve({
      id: userId,
      fullName: username,
    });
  },

  // Check error type
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      return Promise.reject({ redirectTo: "/login" });
    }
    return Promise.resolve();
  },
};

export default authProvider;
