import { Db, MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

let db: Db;

export async function initDB() {
	if (!db) {
		if (!env.DB_CONN_STRING) {
			throw new Error('DB_CONN_STRING environment variable not set.');
		}
		if (!env.DB_NAME) {
			throw new Error('DB_NAME environment variable not set.');
		}

		const client = new MongoClient(env.DB_CONN_STRING, {
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

export function getDB() {
	if (!db) throw new Error('❌ DB not initialized');
	return db;
}
