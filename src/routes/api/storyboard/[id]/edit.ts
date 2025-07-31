import type { RequestHandler } from "@sveltejs/kit";
import type { Storyboard } from "$lib/models/storyboard.model";
import { initDB } from "$lib/server/db";
import { ObjectId } from 'mongodb';
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, params }) => {

    const body = await request.json();

    const { userAction, newPrompt } = body;
    const { id } = params;

    if (!id) {
        return json({ error: 'ID not provided' }, { status: 400 });
    }

    const db = await initDB();

    const storyboards = db.collection<Storyboard>('storyboards');
    
    const storyboard: Storyboard | null = await storyboards.findOne({ _id: new ObjectId(id) });
    if (!storyboard) return json({ error: 'Invalid ID' }, { status: 404 });

    const currentIndex = (storyboard.currentSlide ?? 1) - 1;

    if (userAction === 'reprompt') {
        storyboard.userAction = 'reprompt';
        storyboard.userWantsEdit = true;

        if (newPrompt) {
            if (!storyboard.prompts) {
                storyboard.prompts = [];
            }
            storyboard.prompts[currentIndex] = newPrompt;
        }
    } else if (userAction === 'approve') {
        storyboard.userAction = 'approve';
        storyboard.userWantsEdit = false;
    } else {
        return new Response('Invalid action', { status: 400 });
    }

    await storyboards.updateOne({ _id: new ObjectId(id) }, { $set: storyboard });

    // The client will now call the progress endpoint again to re-run the graph
    return json({ success: true }, { status: 200 });
}