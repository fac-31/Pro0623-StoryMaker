/**
 * Serializes a MongoDB document or any nested structure containing MongoDB-specific types.
 * This function handles ObjectId and Date objects, converting them to strings and ISO strings respectively.
 * It also recursively processes nested objects and arrays.
 *
 * @param {unknown} doc - The document or value to serialize. Can be of any type.
 * @returns {unknown} The serialized version of the input. ObjectIds are converted to strings,
 *                    Dates to ISO strings, and nested objects/arrays are recursively processed.
 *
 * @example
 * const mongoDoc = { _id: new ObjectId("507f1f77bcf86cd799439011"), date: new Date() };
 * const serialized = serializeMongoDocument(mongoDoc);
 * // Result: { _id: "507f1f77bcf86cd799439011", date: "2023-04-01T12:00:00.000Z" }
 */
export function serializeMongoDocument(doc: unknown): unknown {
	if (!doc) return doc;

	if (Array.isArray(doc)) {
		return doc.map(serializeMongoDocument);
	}

	if (typeof doc === 'object' && doc !== null) {
		const serialized: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(doc)) {
			if (
				value &&
				typeof value === 'object' &&
				value !== null &&
				'value' in value &&
				(value as { constructor: { name: string } }).constructor?.name === 'ObjectId'
			) {
				// Convert ObjectId to string
				serialized[key] = value.toString();
			} else if (value instanceof Date) {
				// Convert Date to ISO string
				serialized[key] = value.toISOString();
			} else if (typeof value === 'object' && value !== null) {
				// Recursively serialize nested objects
				serialized[key] = serializeMongoDocument(value);
			} else {
				serialized[key] = value;
			}
		}

		return serialized;
	}

	return doc;
}
