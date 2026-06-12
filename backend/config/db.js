import dotenv from "dotenv";
dotenv.config();
console.log("DATABASE_URL =", process.env.DATABASE_URL ? "OK" : "MISSING");
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;