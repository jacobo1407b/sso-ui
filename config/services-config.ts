
import { Backends } from "./base";


export const SERVICE_CATALOG = {
  'Users': {
    servers: {
      ...Backends.core
    },
    paths: {
      "GetAll": {
        endpoint: "/users",
        method: "GET",
        responseType: "json"
      },
      "UserDetail": {
        endpoint: "/user/{id}",
        method: "GET",
        responseType: "json"
      },
      "CreateUser": {
        endpoint: "/user",
        method: "POST",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "UpdateUser": {
        endpoint: "/user/{id}",
        method: "PUT",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "GetSesions": {
        endpoint: "/user/details/{id}",
        method: "GET",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "UpdatePassword": {
        endpoint: "/user/password/{id}",
        method: "PUT",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "DeleteSession": {
        endpoint: "/user/sesion/{idSession}",
        method: "DELETE",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "SetPreferences": {
        endpoint: "/user/preferences/{id}",
        method: "PUT",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "UploadProfile": {
        endpoint: "/user/image/{userId}",
        method: "PUT",
        responseType: "json"
      }
    },
  },
  "SSO": {
    servers: {
      ...Backends.core
    },
    paths: {
      "GetTotp": {
        endpoint: "/2fa/totp/generate",
        method: "GET",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "VerifyTotp": {
        endpoint: "/2fa/totp/verify",
        method: "POST",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "DeleteTotp": {
        endpoint: "/2fa/totp/cancel/{id}",
        method: "DELETE",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "GetFederateData": {
        endpoint: "/sso/federated",
        method: "GET",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      }
    }
  },
  "Clients": {
    servers: {
      ...Backends.core
    },
    paths: {
      "GetClients": {
        endpoint: "/clients",
        method: "GET",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "GetListGrants": {
        endpoint: "/client/grants/list",
        method: "GET",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "CreateApp": {
        endpoint: "/client",
        method: "POST",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "UpdateApp": {
        endpoint: "/client/{id}",
        method: "PUT",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "DeleteApp": {
        endpoint: "/client/{id}",
        method: "DELETE",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "AppDetails": {
        endpoint: "/client/{id}",
        method: "GET",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "SetGrants": {
        endpoint: "/client/grants/{id}",
        method: "POST",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "UploadIcon": {
        endpoint: "/client/file/{clientId}",
        method: "PUT",
        responseType: "json"
      }
    }
  },
  "Rols": {
    servers: {
      ...Backends.core
    },
    paths: {
      "GetRols": {
        endpoint: "/rols",
        method: "GET",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "GetRol": {
        endpoint: "/rol/{id}",
        method: "GET",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      },
      "SetRolUser": {
        endpoint: "/rols/{id}",
        method: "POST",
        responseType: "json",
        headers: { 'Content-Type': 'application/json' }
      }
    }
  },
  "util": {
    servers: {
      ...Backends.core
    },
    paths: {
      "DownloadImage": {
        endpoint: "/utl/file/download",
        method: "GET",
        responseType: "blob"
      }
    }
  }
} as const;

//CODES
//SERVICE_NOT_DEFINED