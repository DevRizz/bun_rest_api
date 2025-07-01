import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia and this is used to build REST API similarly to how we used express in Node JS")
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
  .post("/post", ({ body, set }: { body: { title: string; content: string }, set : { status  : number } }) : string => {
    set.status = 201; // Set the status code to 201 Created
    return `Post created with title: ${body.title} and content: ${body.content} with status code as ${set.status}`;
  })
  .get("/about", () => "<h1>About Page</h1>")
  .get("/version", ({ store, getDate}) => {
    console.log("Current Date:", getDate());
    console.log("API version:", JSON.stringify(store));
    return `API Version: ${store.example}, Current Date: ${getDate()}`;
  })
  .get("/api/data", () => {
    /* return new Response(
      JSON.stringify({ message: "This is some sample data from the API" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    ); */

    //instead of returning JSON.stringify we can directly return the object and the
    //elysia will automatically convert it to JSON
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

  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);