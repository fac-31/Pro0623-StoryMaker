import { json } from '@sveltejs/kit';
import { getDBAndClient } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import { getUserFromEvent } from '$lib/server/userService';
import type { UpdateFilter } from 'mongodb';
import type { User } from '$lib/models/user.model.js';

export async function POST(event) {
	const { storyboard_id } = await event.request.json();

	if (!storyboard_id) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const { db, client } = await getDBAndClient();
	const session = event.locals.session;

	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const user = await getUserFromEvent(event);
	if (!user) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	const dbSession = client.startSession();

	try {
		await dbSession.withTransaction(async () => {
			await db
				.collection('storyboards')
				.deleteOne({ _id: new ObjectId(storyboard_id) }, { session: dbSession });

			await db
				.collection('users')
				.updateOne(
					{ _id: new ObjectId(user._id) },
					{
						$pull: { projects: { $in: [new ObjectId(user._id)] } } as unknown as UpdateFilter<User>
					},
					{ session: dbSession }
				);

			await db
				.collection('teams')
				.updateMany(
					{ users: { $elemMatch: { user: new ObjectId(user._id) } } },
					{
						$pull: {
							projects: { $in: [new ObjectId(storyboard_id)] }
						} as unknown as UpdateFilter<User>
					},
					{ session: dbSession }
				);
		});
	} finally {
		dbSession.endSession();
	}

	return json({ success: true });
}
