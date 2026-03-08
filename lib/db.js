import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {
    // Verbindungskonfiguration mit Fallbacks für XAMPP
    const config = {
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || 3306,
        database: process.env.MYSQL_DATABASE || 'klub-der-tollen-tiere',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
    };

    const dbconnection = await mysql.createConnection(config);

    try {
        const [results] = await dbconnection.execute(query, values);
        return results;
    } catch (error) {
        console.error("❌ DB-Fehler Details:", error.message);
        throw new Error(error.message);
    } finally {
        // Das "finally" stellt sicher, dass die Verbindung IMMER geschlossen wird,
        // egal ob die Anfrage erfolgreich war oder ein Fehler auftrat.
        await dbconnection.end();
    }
}