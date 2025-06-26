import { json } from '@sveltejs/kit';
import { ChatOpenAI } from '@langchain/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { traceable } from 'langsmith/traceable';
import { TavilySearch } from '@langchain/tavily';
import 'dotenv/config';

const handler = traceable(
  async function ({ prompt }: { prompt: string }) {
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      temperature: 0,
      maxTokens: 256,
    });

    const tool = new TavilySearch({
      maxResults: 5,
    });

    const executor = await initializeAgentExecutorWithOptions([tool], model, {
      agentType: 'openai-functions',
      verbose: true,
    });

    const result = await executor.call({ input: prompt });

    return { result };
  },
  {
    name: 'SvelteKit LangChain Agent Handler',
  }
);

export async function POST({ request }) {
  const { prompt } = await request.json();
  const response = await handler({ prompt });
  return json({ output: response.result });
}