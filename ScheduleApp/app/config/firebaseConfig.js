import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
const config = require('./.config.js');


const firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: config.authDomain,
    databaseURL: config.databaseURL,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId,
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export default db;