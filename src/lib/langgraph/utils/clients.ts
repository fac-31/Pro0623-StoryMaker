import { ChatOpenAI } from '@langchain/openai';
import OpenAI from 'openai';
import { storyOutlineSchema } from '../../schemas/story.schema';

export const llm = new ChatOpenAI({
	modelName: 'gpt-4',
	temperature: 0
}).withStructuredOutput(storyOutlineSchema);

export const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});
