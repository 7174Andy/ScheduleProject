import axios from 'axios';
const config = require('../config/.config.js');

export async function addUser(userId) {
    await axios.put(`${config.BACKEND_URL}/db.json`, {
        [userId]: {
            nickname: 'nickname',
            firstName: 'firstName',
            lastName: 'lastName',
            majors: ['major1', 'major2'],
            college: 'college',
            minors: ['minor1', 'minor2'],
            friends: ['friendId1', 'friendId2'],
            Mon: [{startTime: 10, endTime: 20, course: 'MATH18', enrollmentStatus: 'waitlist'}],
            Tue: [{startTime: 10, endTime: 20, course: 'MATH18', enrollmentStatus: 'waitlist'}],
            Wed: [{startTime: 10, endTime: 20, course: 'MATH18', enrollmentStatus: 'waitlist'}],
            Thu: [{startTime: 10, endTime: 20, course: 'MATH18', enrollmentStatus: 'waitlist'}],
            Fri: [{startTime: 10, endTime: 20, course: 'MATH18', enrollmentStatus: 'waitlist'}],
            friendRequests: ['friendId1', 'friendId2'],
        }
    });
}

export async function getUserData(userId) {
    try {
        const response = await axios.get(`${config.BACKEND_URL}/db.json?orderBy="$key"&equalTo="${userId}"`);
        const userData = response.data[userId];
        console.log(userData);
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Could not fetch user data');
    }
}
