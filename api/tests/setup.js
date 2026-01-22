require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-at-least-32-characters-long';
process.env.DB_PORT = '5433';
process.env.DB_NAME = 'salon_manager_test';

const db = require('../src/config/database');

beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
});

afterAll(async () => {
    await db.destroy();
});
