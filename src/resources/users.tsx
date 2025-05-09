// src/resources/users.tsx
//import React from "react";
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
  ListProps,
  EditProps,
  CreateProps,
} from "react-admin";

// Define types for the choices
interface RoleChoice {
  id: string;
  name: string;
}

const roleChoices: RoleChoice[] = [
  { id: "superadmin", name: "Super Admin" },
  { id: "admin", name: "Admin" },
  { id: "manager", name: "Manager" },
  { id: "user", name: "User" },
];

// User List component
export const UserList: React.FC<ListProps> = (props) => (
  <List {...props} empty={<div>No users found</div>}>
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
export const UserEdit: React.FC<EditProps> = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify("User updated");
    redirect("list");
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
export const UserCreate: React.FC<CreateProps> = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify("User created");
    redirect("list");
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
