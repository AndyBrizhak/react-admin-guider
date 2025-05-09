//import React from "react";
import { Admin, Resource, CustomRoutes } from "react-admin";
import { UserList, UserEdit, UserCreate } from "./resources/users";
import dataProvider from "./dataProvider";
import authProvider from "./authProvider";
import { CustomUserMenu, ProfilePage } from "./components/AuthComponents";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import PeopleIcon from "@mui/icons-material/People";
import { Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";

// Проверка доступа к управлению пользователями
const userAccessCheck = (permissions: string[] | undefined): boolean => {
  // Только superadmin и admin могут управлять пользователями
  return (
    permissions &&
    (permissions.includes("admin") || permissions.includes("users"))
  );
};

const App: React.FC = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={LoginPage}
    requireAuth
    dashboard={Dashboard}
    userMenu={CustomUserMenu}
  >
    {(permissions) => [
      // Управление пользователями - только для superadmin и admin
      userAccessCheck(permissions) ? (
        <Resource
          key="users"
          name="users"
          icon={PeopleIcon}
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          options={{ label: "Пользователи" }}
        />
      ) : null,

      // Добавляем кастомные маршруты
      <CustomRoutes key="custom-routes" noLayout>
        <Route path="/register" element={<RegisterPage />} />
      </CustomRoutes>,
      <CustomRoutes key="profile-routes">
        <Route path="/profile" element={<ProfilePage />} />
      </CustomRoutes>,
    ]}
  </Admin>
);

export default App;
