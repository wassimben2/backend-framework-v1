import express from "express";
import type framework = require("./framework");
const app = express();

export enum method{ //enum for the httpmethods
    GET="get",
    POST="post",
    PUT="put",
    DELETE="delete"
}

export function createRoute(method:method , path:string , action:framework.Action){ //function to create a route with any httpmethod
    app[method](path , action);
    action();
    res.send("Route created successfully");
}

export function startserver(port:number){
    app.listen(port , ()=>{
        console.log("Server started on port : " + port);
    });
}