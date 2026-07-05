"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const singletonTypes = new Set(["siteSettings"]);

const studioPlugins = [
  structureTool({ structure }),
  ...(process.env.NODE_ENV === "production"
    ? []
    : [visionTool({ defaultApiVersion: apiVersion })]),
];

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((template) => !singletonTypes.has(template.templateId)),
  },
  plugins: studioPlugins,
});
