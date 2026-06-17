// MySQL-Bibliothek für die Verbindung zur Datenbank importieren
import mysql from 'mysql2/promise';

// Datenbank-Zugangsdaten aus der .env-Datei laden
import {DB_NAME,DB_USER,DB_PASSWORD,DB_PORT,DB_HOST} from '$env/static/private';

/**
 * Erstellt einen Connection Pool.
 * Dadurch können mehrere Datenbankanfragen effizient verarbeitet werden.
 */
export const pool = mysql.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	port: DB_PORT
});

/**
 * Exportiert den Pool, damit er in anderen Dateien
 * für Datenbankabfragen verwendet werden kann.
 */
export default pool;