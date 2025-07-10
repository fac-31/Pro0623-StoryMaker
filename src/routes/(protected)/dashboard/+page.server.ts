// +page.server.ts - Only load storyboard-specific data
import { getStoryboardsOfUser } from '$lib/server/storyboardService.js';
import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async ({ parent }) => {
//     // Get user data from parent load function
//     const { user } = await parent();
    
//     // Load page-specific data
//     const storyboardIds = await getAllStoryboardsIds();
    
//     return {
//         user,
//         storyboardIds // Don't need to return user - it's already available
//     };
// };



export const load: PageServerLoad = async ({ parent, route }) => {
    const { user } = await parent();
    const storyboards = await getStoryboardsOfUser(user.id);

    return {
        user,
        storyboards
    };
};