import { json } from '@sveltejs/kit';
import { ChatOpenAI } from '@langchain/openai';
import { DallEAPIWrapper } from '@langchain/openai';
import { traceable } from 'langsmith/traceable';
import { TavilySearch } from '@langchain/tavily';
import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import 'dotenv/config';
import type { RequestEvent } from '@sveltejs/kit';

const AgentStateAnnotation = Annotation.Root({
	input: Annotation<string>(),
	searchResult: Annotation<unknown>(),
	llmResult: Annotation<unknown>(),
	imageResult: Annotation<unknown>(),
});

const handler = traceable(
	async function ({ prompt }: { prompt: string }) {
		const model = new ChatOpenAI({
			openAIApiKey: process.env.OPENAI_API_KEY,
			modelName: 'gpt-4o-mini',
			temperature: 0,
			maxTokens: 256
		});
		const tool = new TavilySearch({ maxResults: 5 });
		const dalleTool = new DallEAPIWrapper({
			n: 1,
			model: "dall-e-3",
			apiKey: process.env.OPENAI_API_KEY,
		});

		const workflow = new StateGraph(AgentStateAnnotation)
			.addNode("search", async (state: typeof AgentStateAnnotation.State) => ({
				searchResult: await tool.call({ query: state.input }),
			}))
			.addNode("generate", async (state: typeof AgentStateAnnotation.State) => ({
				llmResult: await model.call([
					{ role: "system", content: "You are a helpful assistant." },
					{ role: "user", content: (typeof state.searchResult === 'object' && state.searchResult !== null && 'answer' in state.searchResult && typeof (state.searchResult as { answer?: string }).answer === 'string') ? (state.searchResult as { answer: string }).answer : state.input }
				])
			}))
			.addNode("generateImage", async (state: typeof AgentStateAnnotation.State) => {
				const imageURL = await dalleTool.invoke(state.input);
				return { imageResult: imageURL };
			})
			.addEdge(START, "search")
			.addEdge("search", "generate")
			.addConditionalEdges("generate", (state: typeof AgentStateAnnotation.State) => {
				const input = state.input.toLowerCase();
				if (input.includes('image') || input.includes('picture')) {
					return "generateImage";
				}
				return END;
			})
			.addEdge("generateImage", END)
			.compile();

		const resultState = await workflow.invoke({ input: prompt });
		return { result: resultState.llmResult, image: resultState.imageResult };
	},
	{ name: 'SvelteKit LangGraph Agent Handler' }
);

export async function POST({ request }: RequestEvent) {
	const { prompt } = await request.json();
	const response = await handler({ prompt });
	return json({ output: response.result, image: response.image });
}
