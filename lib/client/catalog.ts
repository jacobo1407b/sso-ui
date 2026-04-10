export const SERVICE_CATALOG = {
    'Users': {
        paths: {
            "GetAll": {
                endpoint: "/users",
                method: "GET",
                responseType: "json"
            },
            "CreateUser": {
                endpoint: "/users",
                method: "POST",
                responseType: "json"
            },
            "UpdateUser": {
                endpoint: "/users/{id}",
                method: "POST",
                responseType: "json"
            },
            "UploadImage": {
                endpoint: "/users/image",
                method: "POST",
                responseType: "json"
            }
        }
    },
    'Util': {
        paths: {
            "Download": {
                endpoint: "/storage",
                method: "GET",
                responseType: "blob"
            },
            "DeleteSession": {
                endpoint: "/users",
                method: "DELETE",
                responseType: "json"
            },
            "SetPreferences": {
                endpoint: "/preferences",
                method: "PUT",
                responseType: "json"
            }
        }
    },
    'App': {
        paths: {
            "GetAll": {
                endpoint: "/applications",
                method: "GET",
                responseType: "json"
            },
            "GetById": {
                endpoint: "/applications/{id}",
                method: "GET",
                responseType: "json"
            },
            "CreateApp": {
                endpoint: "/applications",
                method: "POST",
                responseType: "json"
            },
            "UpdateApp": {
                endpoint: "/applications/{id}",
                method: "PUT",
                responseType: "json"
            },
            "DeleteApp": {
                endpoint: "/applications/{id}",
                method: "DELETE",
                responseType: "json"
            },
            "UploadIcon": {
                endpoint: "/applications/image",
                method: "POST",
                responseType: "json"
            },
            "SetGrants": {
                endpoint: "/applications/grants",
                method: "POST",
                responseType: "json"
            }
        }
    },
    'Role': {
        paths: {
            "GetAll": {
                endpoint: "/rols",
                method: "GET",
                responseType: "json"
            },
            "GetUnique": {
                endpoint: "/rol/{id}",
                method: "GET",
                responseType: "json"
            },
            "AsignUsers": {
                endpoint: "/rols",
                method: "POST",
                responseType: "json"
            }
        }
    },
    'Mfa': {
        paths: {
            "GetTotp": {
                endpoint: "/mfa/totp",
                method: "GET",
                responseType: "json"
            },
            "verify": {
                endpoint: "/mfa/totp",
                method: "POST",
                responseType: "json"
            },
            "cancel": {
                endpoint: "/mfa/totp",
                method: "DELETE",
                responseType: "json"
            }
        }
    },
    "SSO": {
        paths: {
            "changePassword": {
                endpoint: "/sso",
                method: "POST",
                responseType: "json"
            }
        }
    }
}