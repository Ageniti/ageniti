import { createTaskApp } from "./task-app.js";

const app = createTaskApp();
const handle = app.createHttpHandler();

export async function demoHttpGateway() {
  const actions = await handle({
    method: "GET",
    url: "/ageniti/actions",
  });

  const invoke = await handle({
    method: "POST",
    url: "/ageniti/actions/create_task/invoke",
    body: {
      input: {
        title: "Write the release review summary",
        priority: "high",
      },
      auth: {
        permissions: ["task:create"],
      },
    },
  });

  console.log(JSON.stringify({ actions, invoke }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await demoHttpGateway();
}
