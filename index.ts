
import { createRoute, method, startserver } from "./app.js";
import type {RequestContext} from "./framework.js";
const port = 3000;
type DummyUser = {
    id: number;
    name: string;
    role: string;
}

const dummyUser: DummyUser[] = [{ // our dummyUsers array
    id: 1,
    name: "Wassim",
    role: "admin",
}
,
{
    id: 2,
    name: "Mohamed",
    role: "user",
},
{
    id: 3,
    name: "Ali",
    role: "user",
}];

const checkAdminMiddleware = async (ctx: RequestContext) => { //our middleware that checks if the user is an admin or not , if not i will return an erro message
    if (ctx.data.admin !== "true") { // here we are not checking the role of the user , but just checking if the data that we got from the request is true or false so to make it true we should add "admin":"true" to the request body
        return "You are not an admin";
    }
};

createRoute(method.GET, "/users",[checkAdminMiddleware] , (ctx) => { // here we are creating a route with the GET method and the path "/users" , and we are passing the middlewares and the action to the createRoute function
    return {
        total: dummyUser.length,
        users: dummyUser,
    };
    }
);

createRoute(method.PATCH, "/users/:id",[checkAdminMiddleware] , async (ctx) => { // here we are creating a route with the PATCH method and the path "/users/:id" , and we are passing the middlewares and the action to the createRoute function
   const user = dummyUser.find(u => u.id === parseInt(ctx.data.id)); // here we are finding the user by id that we got from the request params
  
 if (!user) {
       return "User not found";
   }
   user.name = ctx.data.name; // here we are updating the name of the user
   return {
       total: dummyUser.length,
       users: dummyUser,
   };
});


startserver(port);
