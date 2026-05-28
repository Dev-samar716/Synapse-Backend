import app from "./src/app.js";
import dotenv from "dotenv";
import chatRouter from "./src/routers/features/chat/chatRouters.js";

// configuring environmental variables
dotenv.config();

// router middlewares
app.use('/chat', chatRouter)

// server launch
app.listen(3000, () => {
    console.log("Your server is running at http://localhost:3000")
})