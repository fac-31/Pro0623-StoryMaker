import { ChatOpenAI } from '@langchain/openai';
import OpenAI from 'openai';
import { storyOutlineSchema } from '../../schemas/story.schema';
import { env } from '$env/dynamic/private';

export const llm = new ChatOpenAI({
	modelName: 'gpt-4',
	temperature: 0
}).withStructuredOutput(storyOutlineSchema);

export const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});
