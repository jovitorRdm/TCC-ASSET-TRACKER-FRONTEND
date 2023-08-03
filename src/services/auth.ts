import Api from "./api";

const baseUrl = '/login';
async function login( email: string, password: string ) {
    return Api.post( baseUrl, { email, password } ).then(
        (res) => res.data.token);
}

export const authService = {login}
