import axios from 'axios';

const BACKEND_URL = ''

export function test() {
    let testObj = {firstName: 'David', lastName: 'An'}
    axios.post(
        BACKEND_URL + '/test.json',
        testObj
    );
}

export async function fetchTest() {
    const response = await axios.get(BACKEND_URL + '/test.json');

    const test = [];
    
    for (const key in response.data) {
        const testObj = {
            id: key,
            firstName: response.data[key].firstName,
            lastName: response.data[key].lastName
        };
        test.push(testObj);
    }

    console.log(test);

    return test;
}
