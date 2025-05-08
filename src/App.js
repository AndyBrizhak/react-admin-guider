// src/App.js
import React from "react";
import { Admin, Resource } from "react-admin";
import { UserList, UserEdit, UserCreate } from "./resources/users";
import dataProvider from "./dataProvider";
import authProvider from "./authProvider";
import PeopleIcon from "@mui/icons-material/People";
// Import your other resources components here

// Custom permission checking
const userAccessCheck = (permissions) => {
  // Only superadmin and admin can access user management
  return (
    permissions &&
    (permissions.includes("admin") || permissions.includes("users"))
  );
};

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    // Assuming your Login and Register components are already implemented
    // loginPage={LoginPage}
  >
    {(permissions) => [
      // User management - only for superadmin and admin
      permissions && userAccessCheck(permissions) ? (
        <Resource
          name="users"
          icon={PeopleIcon}
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          options={{ label: "Users" }}
        />
      ) : null,

      // Your other resources here
    ]}
  </Admin>
);

export default App;
