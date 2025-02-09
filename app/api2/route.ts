import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { RowDataPacket } from "mysql2";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB2_HOST,
    user: process.env.DB2_USER,
    password: process.env.DB2_PASSWORD,
    database: process.env.DB2_NAME,
    port: process.env.DB2_PORT ? parseInt(process.env.DB2_PORT, 10) : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function GET() {
    try {
        if (!process.env.DB2_HOST || !process.env.DB2_USER || 
            !process.env.DB2_PASSWORD || !process.env.DB2_NAME) {
            throw new Error('Missing database configuration');
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM wp_wprw_roulettewheel ORDER BY time_stamp DESC LIMIT 50"
        );

        return NextResponse.json(rows, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store'
            }
        });
    } catch (err: unknown) {
        console.error('Database error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}