import app from "./src/app.js";
import chatRouter from "./src/routers/features/chat/chatRouters.js";
import pool from "./src/config/db.js";
import authRouter from "./src/routers/features/auth/authRouter.js";

// connecting to DB
try {
    await pool.query("SELECT 1")

    console.log("Successfully connected to the DB!")
} catch(error) {
    console.log(error);
    process.exit(1)
}

// router middlewares
app.use('/chat', chatRouter)
app.use('/auth', authRouter)

// server launch
app.listen(3000, () => {
    console.log("Your server is running at http://localhost:3000")
})