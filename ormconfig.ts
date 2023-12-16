module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  seeds: ['src/seeds/*{.ts,.js}'],
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: true,
};
