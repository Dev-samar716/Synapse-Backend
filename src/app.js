import express from "express"; 
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: "https://synapse-frontend-iota.vercel.app/auth/register", credentials: true}));
app.use(express.json());
app.use(cookieParser());

export default app;