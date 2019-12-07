module.exports = {
 db: process.env.dbName || 'sports_club',
 username: process.env.dbUsername ||'root',
 password: process.env.dbPassword || '',
 dialect:'mysql',
 host: process.env.host || 'localhost',
 port: process.env.dbPort || 3308
}