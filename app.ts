import express from "express";
import type { RequestContext, Action, Middleware } from "./framework.js";
import { exec } from "child_process";
const app = express();
app.use(express.json());
export enum method{ //enum for the httpmethods
    GET="get",
    POST="post",
    PUT="put",
    DELETE="delete",
    PATCH="patch"
}

export function createRoute(method:method , path:string ,middlewares:Middleware[], action:Action){ //function to create a route with any httpmethod
    app[method](path , async(req,res)=>{ // we use the express app to create a route with the specified method and path, and we use an async function to handle the request and response
        const ctx:RequestContext = {data:{  //here we are extracting the data from the request body and put it in "ctx" which will be called when the action is called 
            ...req.body,
            ...req.query,
            ...req.params,
            ...req.headers,
            ...req.cookies,
        }
              
        };
        try{
              for (const middleware of middlewares ) {// here we are calling the middlewares one by one and passing the context to the next middleware
                const resultMiddleware = await middleware(ctx) // here we are calling the middleware with the context
                if(resultMiddleware !== undefined){ // check if the middleware returned a value
                    res.status(400).json({success:false , data:resultMiddleware}); // if the middleware returned a value, we are sending a 400 error to the client
                    return; // we return here to stop the execution of the action if a middleware returned a value
                }
            }
           

       const result = await action(ctx); // here we are calling the action with the context
        res.json({success:true , data:result});// here we are sending the result back to the client
        } catch(e){
            console.error("Error occured in action : " + e);
            res.json({success:false , data:e});
        }
    });
}
export function startserver(port: number) { 
    app.listen(port, () => {
        const heure = new Date().toLocaleTimeString('fr-FR');

        const vert = "\x1b[32m";
        const bleu = "\x1b[34m";
        const cyan = "\x1b[36m";
        const jaune = "\x1b[33m";
        const gras = "\x1b[1m";
        const reset = "\x1b[0m";

        console.log(`\n${bleu}${gras}================================================================${reset}`);
        console.log(`     M Y   S I M P L E   F R A M E W O R K   (v1.0.0)${reset}`);
        console.log(`${bleu}================================================================${reset}`);
        console.log(`     Status  :  ${vert}${gras}Running ${reset}`);
        console.log(`     Time    :  ${heure}`);
        console.log(`     Local   :  ${cyan}${gras}http://localhost:${port}${reset}`);
        console.log(`${bleu}----------------------------------------------------------------${reset}`);
        console.log(`     ${jaune}Thank you for using our custom TypeScript framework!${reset}`);
        console.log(`     If you see this, the server is successfully handling requests.`);
        console.log(`${bleu}================================================================${reset}\n`);

        
        exec(`start http://localhost:${port}/users?admin=true`);
    });
}
