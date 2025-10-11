import { urlBase, urlToken, client_credentials, urlAuthorize, refreshSesion } from "@/config/base";
import getAccessToken from "./token";
import { cookies } from 'next/headers';


export async function refreshToken(refres_tok: string, ip?: string, userAgent?: string) {
    const formdata = refreshSesion(refres_tok, ip, userAgent);
    const result = await fetch(`${urlToken}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formdata, // enviar como string codificado
        credentials: 'include',
    });
    const resp = await result.json();
    return {
        ...resp,
        status: result.status
    }
}
export async function auth(username: string, password: string, ip?: string, userAgent?: string) {
    const formData = client_credentials('password', { username, password }, ip, userAgent);

    const result = await fetch(`${urlToken}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData, // enviar como string codificado
        credentials: 'include',
    });
    return result;
}

export async function authorize(token: string) {
    const data = await fetch(urlAuthorize, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const user = await data.json()
    if (data.status !== 200) return {
        next: false,
        user: null
    };
    if (data.status === 200) return {
        next: true,
        user
    }
}

/** */
export async function getUsers(page = 1, pageSize = 20, user?: string) {
    const token = await getAccessToken('sso_token');
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));

    if (user != null && user !== '') {
        params.set('user', user);
    }

    const users = await fetch(`${urlBase}/users?${params.toString()}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return await users.json()
}

export async function getUserDetail(user_id: string) {
    const token = await getAccessToken('sso_token')

    const user = await fetch(`${urlBase}/user/${user_id}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const us = await user.json()
    return us;
}
export async function createUserServer(payload: any) {
    const token = await getAccessToken('sso_token');
    const user = await fetch(`${urlBase}/user`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    return user;
}

export async function updateUserServ(data: any, id: string) {
    const token = await getAccessToken('sso_token');
    const user = await fetch(`${urlBase}/user/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return user;
}

export async function getDetailsUser(id: string, sesion_id: string) {
    const token = await getAccessToken('sso_token');
    const details = await fetch(`${urlBase}/user/details/${id}?session=${sesion_id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
    return await details.json();
}

export async function updatePassword(id: string, password: string) {
    const token = await getAccessToken('sso_token');
    const details = await fetch(`${urlBase}/user/password/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pass: password
        })
    })
    return details;
}

export async function deleteSession(id: string) {
    const token = await getAccessToken('sso_token');
    const cookieStore = await cookies();
    const access = cookieStore.get('sso_session')?.value ?? "";
    let idSession = id;
    if (id === "") {
        idSession = atob(access)
        cookieStore.delete('sso_refresh')
        cookieStore.delete('sso_refresh_expired')
        cookieStore.delete('sso_session')
        cookieStore.delete('sso_token')
        cookieStore.delete('sso_token_expired')
        cookieStore.delete('sso_user')
    }

    const url = new URL(`${urlBase}/user/sesion/${idSession}`);
    if (id === "") {
        url.searchParams.set("main", "Y");
    }

    return await fetch(url.toString(), {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

}

export async function generateTotp() {
    const token = await getAccessToken('sso_token');
    const details = await fetch(`${urlBase}/2fa/totp/generate`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return details;
}

export async function deleteTotp(id: string) {
    const token = await getAccessToken('sso_token');
    const details = await fetch(`${urlBase}/2fa/totp/cancel/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return details;
}

export async function verifyTotp(id: string, code: string) {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/2fa/totp/verify`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            code
        })
    })
    return validate;
}

export async function setPreferences(id: string, payload: any) {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/user/preferences/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    return validate;
}
/***CLIENTS */

export async function getClients() {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/clients`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return validate;

}

export async function getListGrants() {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/client/grants/list`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return validate;
}

export async function createApp(data: any) {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/client`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return validate;
}

export async function updateApp(data: any, id: string) {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/client/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return validate;
}

export async function deleteApp(id: string) {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/client/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return validate;
}

export async function getAppDetails(id: string) {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/client/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return validate;
}

export async function setGrantsApp(id: string, payload: any) {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/client/grants/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    return validate;
}

export async function getRolsTabel() {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/rols`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
    return validate;
}

export async function detailsRol(id: string) {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/rol/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
    return validate;
}

export async function setRolUser(id: string, body: any) {
    const token = await getAccessToken('sso_token');
    const validate = await fetch(`${urlBase}/rols/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    return validate;
}