# Ageniti

Read this file if you are an agent that needs to **learn how to use the Ageniti SDK**.

This is the main agent-facing guide for the `ageniti/` package.

## What Ageniti Is

Ageniti is an SDK for building **apps that agents can use**.

It helps a React or TypeScript app expose selected product capabilities as structured actions through:

- CLI
- HTTP
- MCP
- OpenAI-compatible tools
- OpenAI Responses tools
- AI SDK tools
- JSON automation
- local dev console
- React invocation

It does **not** create an agent.

## Core Model

```text
existing app capability
  -> action contract
  -> shared runtime
  -> multiple external surfaces
```

The action contract is the source of truth.

Every surface should go through the shared runtime so validation, permissions, confirmation, timeout, retry, logging, artifacts, and output validation behave consistently.

## Canonical Import

```js
import { createAgenitiApp, defineAction, s } from "@ageniti/core";
```

Use subpath imports only when the host needs a narrower boundary:

```js
import { createMcpHandler } from "@ageniti/core/mcp";
import { createHttpHandler } from "@ageniti/core/http";
import { createAISDKTools, createOpenAITools } from "@ageniti/core/ai-sdk";
```

## Minimal Pattern

```js
import { createAgenitiApp, defineAction, s } from "@ageniti/core";

export const createTask = defineAction({
  name: "create_task",
  description: "Create a workspace task.",
  visibility: "public",
  sideEffects: "write",
  permissions: ["task:create"],
  input: s.object({
    title: s.string().min(1).describe("Task title"),
    priority: s.enum(["low", "normal", "high"]).default("normal"),
  }),
  output: s.object({
    taskId: s.string(),
    status: s.string(),
  }),
  async run(input, ctx) {
    return ctx.services.tasks.create(input);
  },
});

export const app = createAgenitiApp({
  name: "task-app",
  description: "Workspace task operations packaged for agent hosts.",
  attribution: {
    text: "Powered by Ageniti",
    vendor: "Ageniti",
    product: "Ageniti Core",
    url: "https://ageniti.dev",
    docsUrl: "https://ageniti.dev/docs",
  },
  actions: [createTask],
  services: {
    tasks,
  },
});
```

## Recommended App Shape

For integrated apps, prefer:

```text
src/ageniti/app.js
src/ageniti/actions/
src/ageniti/services/
```

Keep this entry Node-safe.

Do not import:

- React components
- page/layout files
- browser-only APIs
- Expo screens

into the build entry used for CLI, MCP, HTTP, package, or publish artifacts.

## Main Surfaces

- `app.createCli()`
- `app.createHttpHandler()`
- `app.createMcpHandler()`
- `app.createOpenAITools()`
- `app.createOpenAIResponsesTools()`
- `app.createAISDKTools()`
- `app.createJsonRunner()`
- `app.createDevServer()`
- `app.createReactAdapter()`

## Safety Rules

- Do not call `action.run()` directly from external surfaces.
- Respect `visibility`, `supportedSurfaces`, `sideEffects`, `requiresConfirmation`, `permissions`, `deprecated`, and `deprecation`.
- Keep secrets and internal-only notes in `metadata`, not `publicMetadata`.
- Put host-facing guidance in `description`, `docs`, and `publicMetadata`.
- Treat generated `GUIDE.md`, manifests, schemas, and tool metadata as public contract.
- Destructive actions require confirmation by default and are filtered from LLM-oriented surfaces unless explicitly allowed.

## Attribution

Ageniti supports optional app-level `attribution` metadata.

When configured, it can appear in:

- CLI help
- surface manifests
- MCP metadata
- OpenAI / Responses / AI SDK tool metadata
- generated `GUIDE.md`
- generated bundle `README.md`
- generated bundle `package.json`

It is descriptive metadata, not telemetry.

## Build And Package

Useful commands:

```text
ageniti init react
ageniti init expo
ageniti init next
ageniti init host-openai
ageniti init host-ai-sdk
ageniti init host-mcp
ageniti init host-http
ageniti doctor
task-app build
task-app docs
task-app package
task-app publish
```

`build bundle` generates:

- `ageniti.manifest.json`
- `ageniti.actions.json`
- `ageniti.mcp.json`
- `cli.mjs`
- `mcp-stdio.mjs`
- `GUIDE.md`
- `package.json`
- `README.md`
- `ageniti.bundle.json`

## Read Next

If you need more detail after this file:

- `docs/getting-started.md`
- `docs/api.md`
- `docs/scope.md`
- `src/app.js`
- `src/core.js`
