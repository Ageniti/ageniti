import { createTaskApp } from "./task-app.js";

const app = createTaskApp();

export function createResponsesRequest({ input, model = "your-model" }) {
  return {
    model,
    input,
    tools: app.createOpenAIResponsesTools(),
  };
}

export async function demoResponsesHost() {
  const request = createResponsesRequest({
    input: "Find the blocked tasks and summarize the owners.",
  });

  console.log(JSON.stringify(request, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await demoResponsesHost();
}
