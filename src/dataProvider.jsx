// src/dataProvider.js
import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = process.env.REACT_APP_API_URL || "https://your-api-url.com/api";
const httpClient = fetchUtils.fetchJson;

export const dataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort || {};
    const query = {
      pageNumber: page,
      pageSize: perPage,
      sort: field,
      order: order,
      ...params.filter,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    // Special case for users
    if (resource === "users") {
      return httpClient(
        `${apiUrl}/auth/users?pageNumber=${page}&pageSize=${perPage}`,
        {
          headers: new Headers({
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
        },
      ).then(({ json }) => {
        // Transform the data to React Admin format
        if (json.isSuccess && json.result) {
          return {
            data: json.result,
            total: json.result.length, // This is an approximation since API doesn't return total count
          };
        }
        return { data: [], total: 0 };
      });
    }

    return httpClient(url).then(({ headers, json }) => {
      return {
        data: json.data,
        total: parseInt(headers.get("X-Total-Count") || json.total || 0),
      };
    });
  },

  getOne: (resource, params) => {
    // Special case for users
    if (resource === "users") {
      return httpClient(`${apiUrl}/auth/user/${params.id}`, {
        headers: new Headers({
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      }).then(({ json }) => {
        if (json.isSuccess && json.result) {
          // Transform user data to match React Admin expectations
          return {
            data: {
              id: json.result.id,
              username: json.result.userName,
              email: json.result.email,
              role:
                json.result.roles && json.result.roles.length > 0
                  ? json.result.roles[0].toLowerCase()
                  : "user",
            },
          };
        }
        return { data: {} };
      });
    }

    return httpClient(`${apiUrl}/${resource}/${params.id}`).then(
      ({ json }) => ({
        data: json,
      }),
    );
  },

  create: (resource, params) => {
    // Special case for users (register)
    if (resource === "users") {
      return httpClient(`${apiUrl}/auth/register`, {
        method: "POST",
        body: JSON.stringify(params.data),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      }).then(({ json }) => ({
        data: { ...params.data, id: json.id },
      }));
    }

    return httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    }));
  },

  update: (resource, params) => {
    // Special case for users
    if (resource === "users") {
      // Map React Admin field names to API field names
      const userData = {
        UserName: params.data.username,
        Email: params.data.email,
        Role: params.data.role,
      };

      return httpClient(`${apiUrl}/auth/user/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      }).then(({ json }) => ({
        data: params.data,
      }));
    }

    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: json,
    }));
  },

  delete: (resource, params) => {
    // Special case for users
    if (resource === "users") {
      return httpClient(`${apiUrl}/auth/user/${params.id}`, {
        method: "DELETE",
        headers: new Headers({
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      }).then(({ json }) => ({
        data: params.previousData,
      }));
    }

    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({
      data: json,
    }));
  },

  getMany: (resource, params) => {
    const query = {
      id: params.ids,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({
      data: json,
    }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: field,
      order: order,
      page: page,
      perPage: perPage,
      [params.target]: params.id,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json,
      total: parseInt(headers.get("X-Total-Count")),
    }));
  },

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },
};

export default dataProvider;
