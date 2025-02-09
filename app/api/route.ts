import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool instead of single connections
const pool = mysql.createPool({
    host: process.env.DB1_HOST,
    user: process.env.DB1_USER,
    password: process.env.DB1_PASSWORD,
    database: process.env.DB1_NAME,
    port: process.env.DB1_PORT ? parseInt(process.env.DB1_PORT, 10) : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function GET() {
    try {
        // Validate environment variables
        if (!process.env.DB1_HOST || !process.env.DB1_USER || 
            !process.env.DB1_PASSWORD || !process.env.DB1_NAME) {
            throw new Error('Missing required environment variables');
        }

        // Get connection from pool
        const [rows] = await pool.execute<mysql.RowDataPacket[]>(
            "SELECT * FROM wp_wprw_roulettewheel ORDER BY id DESC LIMIT 100"
        );

        return NextResponse.json(rows, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }
}