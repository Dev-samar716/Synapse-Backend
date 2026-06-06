import { Pool } from 'pg'; 
import dotenv from "dotenv";

// configuring environmental variables
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DB_URL
})

export default pool