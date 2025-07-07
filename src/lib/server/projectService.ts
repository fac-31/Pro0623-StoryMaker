import { ObjectId } from 'mongodb';
import type { InsertOneResult } from 'mongodb';

import { getDB } from './db';

import type { Project, NewProject, UserPrompt } from '$lib/models/project.model';

export async function insertProject(prompts: UserPrompt): Promise<InsertOneResult> {
    const db = getDB();
    const projects = db.collection<NewProject>('projects');

    const newproject: NewProject = {
        prompts,
        visualSlides: [],
        currentSlide: 0,
        totalSlide: prompts.numSlides,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    try {
        return await projects.insertOne(newproject);
    } catch (err) {
        console.error('Failed to insert user:', err);
        throw new Error('Database insert failed');
    }
}

export async function getProjectById(id: string): Promise<Project | null> {
    const db = getDB();
    const projects = db.collection<Project>('projects');

    try {
        return await projects.findOne({ _id: new ObjectId(id) });
    } catch (err) {
        console.error('Failed to get project:', err);
        throw new Error('Database get failed');
    }
}
