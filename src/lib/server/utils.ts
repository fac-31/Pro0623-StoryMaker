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
