import { json } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import type { Storyboard } from '$lib/models/storyboard.model';

export async function POST ({ request }) {
    const {storyboard_id, insertionIndex, newSlideOutline} = await request.json();
    
    if (!storyboard_id || !insertionIndex || !newSlideOutline) {
        return json({error: 'Missing required fields'}, {status: 400});
    };

    const db = await getDB();
    const storyboard: Storyboard | null = await db.collection<Storyboard>('storyboards').findOne({ _id: new ObjectId(storyboard_id)})

    if(!storyboard) {
        return json({ error: 'Storyboard not found'}, {status: 404});
    };
    const newVisualSlide = {
        slideNumber: insertionIndex + 1,
        imageGenerated: false
    };
    newSlideOutline.slideId = insertionIndex + 1;

    storyboard.storyOutline.slideOutlines.splice(insertionIndex, 0, newSlideOutline);

    storyboard.visualSlides.splice(insertionIndex, 0, newVisualSlide);

    for (let i = insertionIndex + 1; i < storyboard.storyOutline.slideOutlines.length; i++) {
        storyboard.storyOutline.slideOutlines[i].slideId = (i + 1);
        storyboard.visualSlides[i].slideNumber = (i + 1);
    };

    await db.collection<Storyboard>('storyboards').updateOne({_id: new ObjectId(storyboard_id)}, {$set: storyboard})

    return json({ id: storyboard_id })
}