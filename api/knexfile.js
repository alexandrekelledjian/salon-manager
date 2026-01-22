require('dotenv').config();

module.exports = {
    development: {
          client: 'pg',
          connection: {
                  host: process.env.DB_HOST || 'localhost',
                  port: process.env.DB_PORT || 5432,
                  user: process.env.DB_USER || 'postgres',
                  password: process.env.DB_PASSWORD || 'postgres',
                  database: process.env.DB_NAME || 'salon_manager',
          },
          migrations: {
                  directory: './src/migrations',
          },
          seeds: {
                  directory: './src/seeds',
          },
    },
    test: {
          client: 'pg',
          connection: {
                  host: process.env.DB_HOST || 'localhost',
                  port: process.env.DB_PORT || 5433,
                  user: process.env.DB_USER || 'postgres',
                  password: process.env.DB_PASSWORD || 'postgres',
                  database: process.env.DB_NAME || 'salon_manager_test',
          },
          migrations: {
                  directory: './src/migrations',
          },
          seeds: {
                  directory: './src/seeds',
          },
    },
};
