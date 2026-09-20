import express from "express";
const app = express();
app.use(express.json());

export type RequestContext = { //we define a request context to pass data to the action
    data: any;
}

export type Action = (ctx : RequestContext) => any; //an action must be a function that takes a request context and returns any value

export type Middleware = (ctx:RequestContext )=> any; //a middleware must be a function that takes a request context and returns any value