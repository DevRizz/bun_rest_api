import { Elysia } from "elysia";
import { pluggin } from "./pluggin"; // Importing the plugin

// Pluggin, we can divide our application into multiple plugins like for spotify we can have pluggin for artists, tracks, albums, etc.
// WE moved the pluggin code to a separate file src/pluggin.ts
/* const pluggin = new Elysia()
  .state("pluggin_Version", "5.8.9") // Setting a state variable for the plugin
  .get("/plugin", () => "This is a plugin route")
  .get("/plugin/about", () => "This is a plugin about route") */

// Application
const app = new Elysia()
  .get("/", () => "Hello Elysia and this is used to build REST API similarly to how we used express in Node JS")
  .use(pluggin) // Using the plugin
  .state({
    description: "API Version",
    type: "string",
    example: "1.0.0",
  }) // Setting a state variable
  .decorate("getDate", () => {
    return new Date().toISOString();
  })

  .get("/post/:id", ({ params }) => {
    return `This is a post with ID: ${params.id}`;
  })

  .post("/post", ({ body, set }: { body: { title: string; content: string }, set: { status: number } }): string => {
    set.status = 201; // Set the status code to 201 Created
    return `Post created with title: ${body.title} and content: ${body.content} with status code as ${set.status}`;
  })

  // Signin route
  .post("/signin", ({ body }: { body: { username: string; password: string } }) => {
    // Basic mock authentication logic
    if (body.username === "admin" && body.password === "admin123") {
      return {
        message: "Sign-in successful",
        user: body.username,
        status: 200,
      };
    } else {
      return {
        message: "Invalid credentials",
        status: 401,
      };
    }
  })

  .get("/about", () => "<h1>About Page</h1>")

  .get("/version", ({ store, getDate }) => {
    console.log("Current Date:", getDate());
    console.log("API version:", JSON.stringify(store));

    // calling pluggin state variable
    console.log("Pluggin Version:", store.pluggin_Version);
    return `API Version: ${store.example}, Current Date: ${getDate()}`;
  })

  .get("/api/data", () => {
    /* return new Response(
      JSON.stringify({ message: "This is some sample data from the API" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    ); */

    // instead of returning JSON.stringify we can directly return the object and the
    // elysia will automatically convert it to JSON
    return {
      message: "This is some sample data from the API",
      status: 200,
    };
  })

  .get("/greet", () => {
    return new Response(Bun.file("./greet.txt"), {
      headers: { "Content-Type": "text/plain" },
    });
  })

  .get("/feed", () => {
    throw new Error("This is a sample error for testing error handling");
  })

  .onError(({ code, error }) => {
    return new Response(`<pre>${error}</pre>`, {
      headers: { "Content-Type": "text/html" },
    });
  })

  // Grouping the routes
  .group("/group", (group) =>
    group
      .get("/hello", () => "Hello from the group route")

      .get("/world", () => "World from the group route")

      .get("/version", ({ store }) => {
        return `Group Version: ${store.example}`;
      })

      .delete("/delete/:id", ({ params }) => {
        return `Deleted item with ID: ${params.id}`;
      })

      .post("/comment", ({ body, set } : { body: {postID: number; comment: string; author: string}, set: { status: number } }) => {
        set.status = 201;
        return {
          message: `Comment added to post with ID: ${body.postID} by author ${body.author}`,
          comment: body.comment,
          status: set.status,
        }
      })

      .post("/signin", ({ body } : { body : {username: string; password: string}}) => {
        if (body.username === "groupUser" && body.password === "pass123") {
          return {
            message: "Group route sign-in successful",
            user: body.username,
            status: 200,
          };
        } else {
          return {
            message: "Invalid credentials for group route",
            status: 401,
          };
        }
      })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);