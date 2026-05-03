import { defaultSurfaceAdapters } from "./adapters.js";
import {
  createAISDKTools,
  createFunctionCallingManifest,
  createOpenAIResponsesTools,
  createOpenAITools,
} from "./ai-sdk.js";
import { buildArtifacts, packageArtifacts, publishArtifacts } from "./build.js";
import { createCli } from "./cli.js";
import { createRuntime } from "./core.js";
import { createDevServer } from "./dev-server.js";
import { createGuideDoc, exportDocs } from "./docs-export.js";
import { createHttpHandler, createHttpServer } from "./http.js";
import { createJsonRunner } from "./json-runner.js";
import { lintActions } from "./lint.js";
import { createSurfaceManifest } from "./manifest.js";
import { createMcpHandler, createMcpManifest } from "./mcp.js";
import { createReactActionAdapter } from "./react.js";

export function createAgenitiApp(options) {
  if (!options?.name) {
    throw new TypeError("createAgenitiApp() requires an app name.");
  }

  const actions = options.actions ?? [];
  const adapters = options.adapters ?? defaultSurfaceAdapters();
  const buildOptions = options.build ?? {};
  const appDescription = options.description;
  const appDocs = options.docs ?? {};
  const attribution = options.attribution;
  const runtime = options.runtime ?? createRuntime({
    actions,
    services: options.services,
    permissionChecker: options.permissionChecker,
    middleware: options.middleware,
  });

  return {
    name: options.name,
    actions,
    adapters,
    runtime,
    manifest() {
      return createSurfaceManifest({
        appName: options.name,
        actions,
        adapters,
        attribution,
      });
    },
    lint() {
      return lintActions(actions);
    },
    actionManifest(manifestOptions) {
      return createSurfaceManifest({
        appName: options.name,
        actions,
        adapters,
        attribution,
        ...manifestOptions,
      }).actions;
    },
    createCli(cliOptions = {}) {
      return createCli({
        name: options.name,
        actions,
        runtime,
        adapters,
        buildOptions,
        description: appDescription,
        docs: appDocs,
        attribution,
        ...cliOptions,
      });
    },
    createMcpHandler(mcpOptions = {}) {
      return createMcpHandler({
        actions,
        runtime,
        attribution,
        ...mcpOptions,
      });
    },
    createMcpManifest() {
      return createMcpManifest(actions, { attribution });
    },
    createJsonRunner(jsonOptions = {}) {
      return createJsonRunner({
        actions,
        runtime,
        ...jsonOptions,
      });
    },
    createHttpHandler(httpOptions = {}) {
      return createHttpHandler({
        actions,
        runtime,
        ...httpOptions,
      });
    },
    createHttpServer(httpOptions = {}) {
      return createHttpServer({
        actions,
        runtime,
        ...httpOptions,
      });
    },
    createOpenAITools(aiOptions = {}) {
      return createOpenAITools(actions, {
        attribution,
        ...aiOptions,
      });
    },
    createOpenAIResponsesTools(aiOptions = {}) {
      return createOpenAIResponsesTools(actions, {
        attribution,
        ...aiOptions,
      });
    },
    createAISDKTools(aiOptions = {}) {
      return createAISDKTools(actions, {
        attribution,
        runtime,
        ...aiOptions,
      });
    },
    createFunctionCallingManifest(aiOptions = {}) {
      return createFunctionCallingManifest(actions, {
        attribution,
        runtime,
        ...aiOptions,
      });
    },
    createReactAdapter(reactOptions = {}) {
      return createReactActionAdapter({
        actions,
        runtime,
        ...reactOptions,
      });
    },
    createDevServer(devOptions = {}) {
      return createDevServer({
        name: options.name,
        actions,
        runtime,
        ...devOptions,
      });
    },
    createGuideDoc(docOptions = {}) {
      return createGuideDoc({
        appName: options.name,
        appDescription,
        docs: appDocs,
        actions,
        attribution,
        ...docOptions,
      });
    },
    exportDocs(docOptions = {}) {
      return exportDocs({
        appName: options.name,
        appDescription,
        docs: appDocs,
        actions,
        attribution,
        ...docOptions,
      });
    },
    build(artifactOptions = {}) {
      return buildArtifacts({
        appName: options.name,
        appDescription,
        docs: appDocs,
        actions,
        adapters,
        attribution,
        ...buildOptions,
        ...artifactOptions,
      });
    },
    package(packageOptions = {}) {
      return packageArtifacts({
        appName: options.name,
        appDescription,
        docs: appDocs,
        actions,
        adapters,
        attribution,
        ...buildOptions,
        ...packageOptions,
      });
    },
    publish(publishOptions = {}) {
      return publishArtifacts({
        appName: options.name,
        appDescription,
        docs: appDocs,
        actions,
        adapters,
        attribution,
        ...buildOptions,
        ...publishOptions,
      });
    },
  };
}
