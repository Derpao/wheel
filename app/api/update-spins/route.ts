import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request: Request) {
  try {
    const { phone_number, spinsleft } = await request.json();

    // Validate input
    if (!phone_number || spinsleft === undefined) {
      return NextResponse.json(
        { error: 'เบอร์โทรศัพท์และจำนวนรอบหมุนจำเป็นต้องระบุ' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: process.env.DB1_HOST,
      user: process.env.DB1_USER,
      password: process.env.DB1_PASSWORD,
      database: process.env.DB1_NAME,
      port: process.env.DB1_PORT ? parseInt(process.env.DB1_PORT, 10) : undefined
    });

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      "UPDATE wp_wprw_roulettewheel SET spinsleft = ? WHERE phone_number = ?",
      [spinsleft, phone_number]
    );

    connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'ไม่พบเบอร์โทรศัพท์นี้ในระบบ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'อัพเดทสำเร็จ',
      data: { phone_number, spinsleft }
    });

  } catch (error) {
    console.error('Error updating spins:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล' },
      { status: 500 }
    );
  }
}