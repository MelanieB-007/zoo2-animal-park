import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {
    const dbconnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT,
    });

    try {
        const [results] = await dbconnection.execute(query, values);
        dbconnection.end();
        console.log("✅ DB-Anfrage erfolgreich");
        return results;
    } catch (error) {
        console.error("❌ DB-Fehler:", error.message);
        throw Error(error.message);
    }
}