import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "../sanity/schemas";

export default defineConfig({
  name: "as-enterprises",
  title: "AS Enterprises CMS",
  projectId: "g3xfk7os",
  dataset: "production",
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  basePath: "/studio",
});
