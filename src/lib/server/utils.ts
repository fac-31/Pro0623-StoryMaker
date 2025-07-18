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
	// I had to ask ChatGPT like 10 times to fix it's own function they keep screwing up

	if (!doc) return doc;

	if (isObjectIdLike(doc)) {
		return bufferToHex(doc.buffer);
	}

	if (Array.isArray(doc)) {
		return doc.map(serializeMongoDocument);
	}

	if (typeof doc === 'object' && doc !== null) {
		const serialized: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(doc)) {
			if (isObjectIdLike(value)) {
				serialized[key] = bufferToHex(value.buffer);
			} else if (value instanceof Date) {
				serialized[key] = value.toISOString();
			} else {
				serialized[key] = serializeMongoDocument(value);
			}
		}

		return serialized;
	}

	return doc;
}

function isObjectIdLike(
	value: any
): value is { buffer: number[] | Uint8Array | Record<string, number> } {
	if (!value || typeof value !== 'object') return false;

	// Check for `{ buffer: { '0': number, '1': number, ... } }`
	const buffer = value.buffer;
	if (!buffer || typeof buffer !== 'object') return false;

	const keys = Object.keys(buffer);
	return (
		keys.length === 12 && keys.every((k) => !isNaN(Number(k)) && typeof buffer[k] === 'number')
	);
}

function bufferToHex(buffer: Uint8Array | number[] | Record<string, number>): string {
	const byteArray = Array.isArray(buffer)
		? buffer
		: Array.from({ length: 12 }, (_, i) => buffer[i.toString()]);
	return byteArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
