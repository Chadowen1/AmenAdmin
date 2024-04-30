import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.Dw_HOST,
    port: process.env.DW_PORT,
    user: process.env.DW_USER,
    password: process.env.DW_PASSWORD,
    database: process.env.DW_NAME,
});

export default pool;