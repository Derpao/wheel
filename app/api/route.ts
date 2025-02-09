import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export async function GET() {
  try {
      const connection = await mysql.createConnection({
          host: process.env.DB1_HOST,
          user: process.env.DB1_USER,
          password: process.env.DB1_PASSWORD,
          database: process.env.DB1_NAME,
          port: process.env.DB1_PORT ? parseInt(process.env.DB1_PORT, 10) : undefined
      });

      const [rows] = await connection.execute<mysql.RowDataPacket[]>(
          "SELECT * FROM wp_wprw_roulettewheel ORDER BY time_stamp DESC LIMIT 50"
      );

      connection.end(); // ปิดการเชื่อมต่อ
      return NextResponse.json(rows, { status: 200 });
  } catch (err: unknown) {
    let message = 'An unknown error occurred';
    if (err instanceof Error) {
      message = err.message;
    } else if (err && typeof err === 'object' && 'message' in err) {
      message = String(err.message);
    } else if (typeof err === 'string') {
      message = err;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}