import { ObjectId } from "mongodb";
import { getDB } from './db';
import type { User} from '$lib/models/user.model';
import type { Storyboard } from '$lib/models/storyboard.model';


export function serializeMongoDocument(doc: any): any {
    if (!doc) return doc;
    
    if (Array.isArray(doc)) {
        return doc.map(serializeMongoDocument);
    }
    
    if (typeof doc === 'object' && doc !== null) {
        const serialized: any = {};
        
        for (const [key, value] of Object.entries(doc)) {
            if (value && typeof value === 'object' && value.constructor.name === 'ObjectId') {
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

export async function getAllStoryboardsIds(): Promise<string[]> {
    const db = getDB();
    const collection = db.collection('storyboards');

    try {
        const storyboards = await collection.find({}, { projection: { _id: 1 } }).toArray();
        return storyboards.map(storyboard => storyboard._id.toString());
    } catch (err) {
        console.error('Failed to get all storyboards:', err);
        throw new Error('Database find failed');
    }
}

export async function getStoryboardsOfUser(supabaseUserId : string): Promise<Storyboard[]> {
    const db = getDB();
    const users = db.collection('users');

    try {
        const userDoc = await await db.collection('users').findOne({ 
            supabase: supabaseUserId  // Use supabase field
        });
        const user = userDoc as User;
        if (!user ) {
            console.log('User not found:', supabaseUserId);
            return [];
        }
        
        const storyboardsCollection = db.collection('storyboards');

        const storyboards = await storyboardsCollection
            .find({ _id: { $in: user.projects.map(id => new ObjectId(id)) } })
            .toArray();

        const serialized = serializeMongoDocument(storyboards);
        return serialized as Storyboard[];

    } catch (err) {
        console.error('Failed to get all storyboards:', err);
        throw new Error('Database find failed');
    }
}

