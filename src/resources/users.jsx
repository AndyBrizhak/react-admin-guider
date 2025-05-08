// src/resources/users.js
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  DeleteButton,
  EditButton,
  required,
  email,
  minLength,
  useNotify,
  useRedirect,
} from "react-admin";

const roleChoices = [
  { id: "superadmin", name: "Super Admin" },
  { id: "admin", name: "Admin" },
  { id: "manager", name: "Manager" },
  { id: "user", name: "User" },
];

// User List component
export const UserList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="username" />
      <EmailField source="email" />
      <TextField source="role" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// User Edit component
export const UserEdit = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify("User updated");
    redirect("list", props.basePath);
  };

  return (
    <Edit {...props} mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="username" validate={required()} />
        <TextInput source="email" validate={[required(), email()]} />
        <SelectInput
          source="role"
          choices={roleChoices}
          validate={required()}
        />
      </SimpleForm>
    </Edit>
  );
};

// User Create component
export const UserCreate = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify("User created");
    redirect("list", props.basePath);
  };

  const validatePassword = [
    required(),
    minLength(6, "Password must be at least 6 characters"),
  ];

  return (
    <Create {...props} mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <TextInput source="username" validate={required()} />
        <TextInput source="email" validate={[required(), email()]} />
        <TextInput
          source="password"
          type="password"
          validate={validatePassword}
        />
        <SelectInput
          source="role"
          choices={roleChoices}
          validate={required()}
          defaultValue="user"
        />
      </SimpleForm>
    </Create>
  );
};
