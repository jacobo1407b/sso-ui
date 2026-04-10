'use server';
import OAuthServer, { OAuthUser, AutorizationCodeResponse } from "@/lib/Auth";


export async function loginAction(username: string, password: string): Promise<OAuthUser | null> {
    return new Promise((resolve, reject) => {
        new OAuthServer()
            .auth(username, password)
            .then(async (auth) => {
                await auth.setCookies();
                resolve(auth.getUserData())
            })
            .catch((err) => {
                reject(`${err.status}|${err.code}|${err.details}`);
            })
    });
}


export async function logout() {
    return new Promise((resolve, reject) => {
        new OAuthServer()
            .revoke()
            .then((revok) => {
                resolve(true);
            }).catch((err) => {
                reject(false)
            })
    })
}

export async function refreshMfa() {
    return new Promise((resolve, reject) => {
        new OAuthServer()
            .refresh()
            .then(async (auth) => {
                await auth.setCookies();
                resolve(true);
            })
            .catch((err) => {
                console.log("ERROR MFA REFRESH")
                console.log(err)
                reject(`${err.status}|${err.code}|${err.details}`);
            })
    })
}

export async function AutorizeAction(client: string, state: string, code_challenge: string): Promise<AutorizationCodeResponse> {
    return new Promise((resolve, reject) => {
        new OAuthServer()
            .authorization_code({
                client_id: client,
                response_type: "code",
                state: state,
                code_challenge: code_challenge,
                code_challenge_method: "S256"
            })
            .then((resp) => {
                resolve(resp);
            })
            .catch((err) => {
                reject(err)
            })
    });
}
