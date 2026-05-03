import { createTaskApp } from "./task-app.js";

const app = createTaskApp();
const handle = app.createMcpHandler();

export async function demoMcpHost() {
  const list = await handle({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
  });

  const call = await handle({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "search_tasks",
      arguments: {
        status: "blocked",
      },
    },
  });

  console.log(JSON.stringify({ list, call }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await demoMcpHost();
}
