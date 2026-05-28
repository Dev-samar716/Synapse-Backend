import pool from "./src/config/db.js";
import app from "./src/app.js";
import chatRouter from "./src/routers/features/chat/chatRouters.js";


// DB connection
try {
    await pool.query('SELECT 1');

    console.log("Database connection successful!");
} catch(error) {
    console.log(error);
    process.exit(1);
}

// router middlewares
app.use('/chat', chatRouter)

// server launch
app.listen(3000, () => {
    console.log("Your server is running at http://localhost:3000")
})