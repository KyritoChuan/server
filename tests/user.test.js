const supertest = require('supertest');
const app = require('../app');
const { API_VERSION } = require('../config');

const api = supertest(app);

beforeEach(async () => {

});

describe('Get the users', () => {
    test('users are returned as json', async () => {
        await api.get(`/api/${API_VERSION}/users`).expect(200).expect('Content-Type', /application\/json/);
    });

});