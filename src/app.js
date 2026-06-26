import express from "express"; 
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

const availableOrigins = [
    "http://localhost:5174",
    "https://synapse-frontend-iota.vercel.app"
]

app.use(cors({ origin: availableOrigins, credentials: true}));
app.use(express.json());
app.use(cookieParser());

export default app;