module.exports = {
  connectionLimit: 10,
  host: 'db',
  port: 3306,
  user: 'root',
  password: 'example',
  database: 'example',
  debug: process.env.NODE_ENV == 'production' ? true : false
}