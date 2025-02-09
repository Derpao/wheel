import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { RowDataPacket } from "mysql2";

dotenv.config();

// Define the interface for the data
interface RouletteData {
  id: number;
  phone_number: string;
  coupon_code: string;
  spinsleft: number;
  ip: string;
  cookie: string;
  time_stamp: string;
}

export async function GET() {
  try {
      // เชื่อมต่อฐานข้อมูล MySQL
      const connection = await mysql.createConnection({
          host: process.env.DB2_HOST,
          user: process.env.DB2_USER,
          password: process.env.DB2_PASSWORD,
          database: process.env.DB2_NAME,
          port: process.env.DB2_PORT ? parseInt(process.env.DB2_PORT, 10) : undefined
      });

      // ดึงข้อมูล 50 แถวล่าสุด เรียงตามเวลา
      const [rows] = await connection.execute<RowDataPacket[]>(
          "SELECT * FROM wp_wprw_roulettewheel ORDER BY time_stamp DESC LIMIT 50"
      );

      connection.end(); // ปิดการเชื่อมต่อ
      return NextResponse.json(rows, { status: 200 });
  } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}