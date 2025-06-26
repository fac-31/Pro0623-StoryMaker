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

// How we might add langgraph
/*
    -import { json } from '@sveltejs/kit';
    -import { ChatOpenAI } from '@langchain/openai';
    -import { initializeAgentExecutorWithOptions } from 'langchain/agents';
    -import { traceable } from 'langsmith/traceable';
    -import { TavilySearch } from '@langchain/tavily';
    -import 'dotenv/config';
    +import { json } from '@sveltejs/kit';
    +import { ChatOpenAI } from '@langchain/openai';
    +import { traceable } from 'langsmith/traceable';
    +import { TavilySearch } from '@langchain/tavily';
    +import { Graph } from '@langchain/langgraph';
    +import 'dotenv/config';
    @@ 8,33c9, Thirty‑something
    -const handler = traceable(
    -  async function ({ prompt }: { prompt: string }) {
    -    const model = new ChatOpenAI({
    -      openAIApiKey: process.env.OPENAI_API_KEY,
    -      modelName: 'gpt-4o-mini',
    -      temperature: 0,
    -      maxTokens: 256,
    -    });
    -
    -    const tool = new TavilySearch({
    -      maxResults: 5,
    -    });
    -
    -    const executor = await initializeAgentExecutorWithOptions([tool], model, {
    -      agentType: 'openai-functions',
    -      verbose: true,
    -    });
    -
    -    const result = await executor.call({ input: prompt });
    -
    -    return { result };
    -  },
    -  {
    -    name: 'SvelteKit LangChain Agent Handler',
    -  }
    -);
    +const handler = traceable(
    +  async function ({ prompt }: { prompt: string }) {
    +    // ——————————————————————————
    +    // (A) Setup the underlying LLM & Tool
    +    // ——————————————————————————
    +    const model = new ChatOpenAI({
    +      openAIApiKey: process.env.OPENAI_API_KEY,
    +      modelName: 'gpt-4o-mini',
    +      temperature: 0,
    +      maxTokens: 256,
    +    });
    +    const tool = new TavilySearch({ maxResults: 5 });
    +
    +    // ——————————————————————————
    +    // (B) Build a tiny Graph workflow
    +    // ——————————————————————————
    +    const graph = new Graph({ name: 'LangGraph-Agent' });
    +
    +    // 1️⃣ start node: just forwards the prompt
    +    const start = graph.addNode('start', {
    +      fn: async ({ input }: { input: string }) => input
    +    });
    +
    +    // 2️⃣ search node: calls our TavilySearch tool
    +    const searchNode = graph.addNode('web_search', {
    +      fn: async ({ input }: { input: string }) =>
    +        tool.call({ input })
    +    });
    +
    +    // 3️⃣ llm node: calls the ChatOpenAI model
    +    const llmNode = graph.addNode('generate', {
    +      fn: async ({ input }: { input: string }) =>
    +        model.call([
    +          { role: 'system', content: 'You are a helpful assistant.' },
    +          { role: 'user', content: input }
    +        ])
    +    });
    +
    +    // Wire them together: start → search → llm
    +    graph.addEdge(start, searchNode);
    +    graph.addEdge(searchNode, llmNode);
    +
    +    // Execute the graph end‑to‑end
    +    const result = await graph.execute({ input: prompt });
    +    return { result };
    +  },
    +  { name: 'SvelteKit LangGraph Agent Handler' }
    +);
*/