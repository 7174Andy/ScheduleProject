import axios from 'axios';
const config = require('../config/.config.js');

export async function addUser(userId) {
    await axios.put(`${config.BACKEND_URL}/db/${userId}.json`, {
        nickname: 'nickname',
        firstName: 'firstName',
        lastName: 'lastName',
        majors: ['major1', 'major2'],
        college: 'college',
        classLvl: 'Sophomore',
        minors: ['minor1', 'minor2'],
        friends: ['friendId1', 'friendId2'],
        Mon: [{startTime: 10, endTime: 20, course: 'MATH18', enrollmentStatus: 'waitlist', professor: 'p1', color: 'blue'}],
        Tue: [{startTime: 10, endTime: 20, course: 'MATH18', enrollmentStatus: 'waitlist', professor: 'p1', color: 'blue'}],
        Wed: [{startTime: 10, endTime: 20, course: 'MATH18', enrollmentStatus: 'waitlist', professor: 'p1', color: 'blue'}],
        Thu: [{startTime: 10, endTime: 20, course: 'MATH18', enrollmentStatus: 'waitlist', professor: 'p1', color: 'blue'}],
        Fri: [{startTime: 10, endTime: 20, course: 'MATH18', enrollmentStatus: 'waitlist', professor: 'p1', color: 'blue'}],
        friendRequests: ['friendId1', 'friendId2'],
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
