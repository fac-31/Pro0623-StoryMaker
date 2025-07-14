import { Db, MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

let db: Db;
let client: MongoClient | null = null;

/**
 * Initializes the database connection.
 * @throws {Error} If DB_CONN_STRING or DB_NAME environment variables are not set.
 * @returns {Promise<Db>} A promise that resolves to the connected database instance.
 */
export async function initDB(): Promise<Db> {
	if (!db) {
		if (!env.DB_CONN_STRING) {
			throw new Error('DB_CONN_STRING environment variable not set.');
		}
		if (!env.DB_NAME) {
			throw new Error('DB_NAME environment variable not set.');
		}

		client = new MongoClient(env.DB_CONN_STRING, {
			tls: true,
			tlsAllowInvalidCertificates: true, // Only for development
			serverSelectionTimeoutMS: 5000,
			connectTimeoutMS: 10000
		});
		//const client = new MongoClient(env.DB_CONN_STRING);

		console.log('Connecting to MongoDB...');
		await client.connect();
		db = client.db(env.DB_NAME);
		console.log('✅ MongoDB connected');
	}
	return db;
}

/**
 * Retrieves the initialized database instance.
 * @throws {Error} If the database has not been initialized.
 * @returns {Db} The initialized database instance.
 */
export function getDB(): Db {
	if (!db) throw new Error('❌ DB not initialized');
	return db;
}

/**
 * Retrieves both the initialized database instance and the MongoDB client.
 * @throws {Error} If the database has not been initialized.
 * @returns {{ db: Db; client: MongoClient }} An object containing the database instance and MongoDB client.
 */
export function getDBAndClient(): { db: Db; client: MongoClient } {
	if (!db || !client) throw new Error('❌ DB not initialized');
	return { db, client };
}
