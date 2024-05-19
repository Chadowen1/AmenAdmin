import { ClickHouse } from 'clickhouse';
import dotenv from 'dotenv';

dotenv.config();

const clickhouse = new ClickHouse({
    url: process.env.CLICKHOUSE_URL,
    port: process.env.CLICKHOUSE_PORT,
    debug: false,
    basicAuth: {
        username: process.env.CLICKHOUSE_USER,
        password: process.env.CLICKHOUSE_PASSWORD,
    },
    isUseGzip: false,
    format: "json", // "json" || "csv" || "tsv"
    raw: false
});

export default clickhouse;