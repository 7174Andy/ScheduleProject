import axios from 'axios';
const config = require('../config/.config.js');

export async function authenticate(mode, email, password) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${config.API_KEY}`;

    const response = await axios.post(url, {
        email: email,
        password: password,
        returnSecureToken: true
    });

    const token = response.data.idToken;

    return { token: token, userId: response.data.localId };
}

export function createUser(email, password) {
    return authenticate('signUp', email, password);

}

export function login(email, password) {
    return authenticate('signInWithPassword', email, password);
}