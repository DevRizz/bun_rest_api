import { Elysia } from "elysia";

export const pluggin = new Elysia()
  .state("pluggin_Version", "5.8.9") // Setting a state variable for the plugin
  .get("/plugin", () => "This is a plugin route")
  .get("/plugin/about", () => "This is a plugin about route")