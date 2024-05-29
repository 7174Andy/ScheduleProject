import axios from 'axios';
const config = require('../config/.config.js');
import { app } from "../config/firebaseConfig";
import { ref, getDownloadURL, getStorage } from "firebase/storage";


export async function addUser(userId) {
    await axios.put(`${config.BACKEND_URL}/db/${userId}.json`, {
        nickname: 'nickname',
        firstName: 'firstName',
        lastName: 'lastName',
        friends: [],
        hashtags: ['college', 'classLvl', 'major', 'minor'],
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        friendRequests: [],
    });
}

export async function getUserData(userId) {
    try {
        const response = await axios.get(`${config.BACKEND_URL}/db.json?orderBy="$key"&equalTo="${userId}"`);
        const userData = response.data[userId];

        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Could not fetch user data');
    }
}


export async function getUserProfilePic(userId) {
    const storage = getStorage(app);
    const pathReference = ref(storage, userId);
    try {
        const url = await getDownloadURL(pathReference);
        return url;
    } catch (error) {
        // You might want to handle the error here, depending on your use case
        return null; // or throw error; to propagate the error further
    }
}