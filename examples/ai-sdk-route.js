import { createTaskApp } from "./task-app.js";

const app = createTaskApp();

export function createAISDKRouteContext({ model, auth }) {
  return {
    model,
    tools: app.createAISDKTools({
      returnEnvelope: true,
    }),
    toolContext: {
      auth,
    },
  };
}

export async function runRouteDemo() {
  const context = createAISDKRouteContext({
    model: "your-model-instance",
    auth: {
      permissions: ["task:create"],
    },
  });

  const result = await context.tools.create_task.execute({
    title: "Follow up with the design review owner",
    priority: "high",
  }, {
    auth: context.toolContext.auth,
  });

  console.log(JSON.stringify(result, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runRouteDemo();
}
