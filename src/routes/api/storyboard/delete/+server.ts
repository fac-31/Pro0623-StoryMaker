import { json } from '@sveltejs/kit';
import { initDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from '@sveltejs/kit';
import { getUserFromEvent } from '$lib/server/userService';
import fs from 'fs';
import path from 'path';

interface DeleteStoryboardRequest {
	storyboardId: string;
}

export const DELETE: RequestHandler = async (event) => {
	const { storyboardId } = (await event.request.json()) as DeleteStoryboardRequest;

	if (!storyboardId) {
		return json({ error: 'Missing storyboardId' }, { status: 400 });
	}

	const user = await getUserFromEvent(event);
	if (!user) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	const db = await initDB();

	try {
		// Check if storyboard exists and user has access to it
		const storyboard = await db
			.collection('storyboards')
			.findOne({ _id: new ObjectId(storyboardId) });

		if (!storyboard) {
			return json({ error: 'Storyboard not found' }, { status: 404 });
		}

		// Check if user has permission to delete this storyboard
		// (User should own it or be part of a team that owns it)
		const userProjects = user.projects as string[];
		const userTeams = await db.collection('teams').find({ 'users.user': user._id }).toArray();

		const teamProjects = userTeams.flatMap((team) => team.projects as string[]);
		const allAccessibleProjects = [...userProjects, ...teamProjects];

		if (!allAccessibleProjects.includes(storyboardId)) {
			return json({ error: 'Permission denied' }, { status: 403 });
		}

		// Delete the storyboard from database
		const deleteResult = await db
			.collection('storyboards')
			.deleteOne({ _id: new ObjectId(storyboardId) });

		if (deleteResult.deletedCount === 0) {
			return json({ error: 'Failed to delete storyboard' }, { status: 500 });
		}

		// Remove storyboard from user's projects
		await db
			.collection('users')
			.updateOne({ _id: new ObjectId(user._id) }, { $pull: { projects: storyboardId } } as any);

		// Remove storyboard from all teams that have it
		await db.collection('teams').updateMany({ projects: { $in: [storyboardId] } }, {
			$pull: { projects: storyboardId }
		} as any);

		// Clean up generated game files if they exist
		try {
			const gameDir = path.join('static', 'games', storyboardId);
			if (fs.existsSync(gameDir)) {
				fs.rmSync(gameDir, { recursive: true, force: true });
				console.log(`Cleaned up game files for storyboard ${storyboardId}`);
			}
		} catch (cleanupError) {
			console.warn(`Failed to clean up game files for ${storyboardId}:`, cleanupError);
			// Don't fail the delete operation if cleanup fails
		}

		return json({ success: true, message: 'Storyboard deleted successfully' });
	} catch (err) {
		console.error('Failed to delete storyboard:', err);
		return json({ error: 'Database operation failed' }, { status: 500 });
	}
};
