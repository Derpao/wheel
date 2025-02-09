import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

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

export async function POST(request: Request) {
    try {
        // Validate environment variables
        if (!process.env.DB2_HOST || !process.env.DB2_USER || 
            !process.env.DB2_PASSWORD || !process.env.DB2_NAME) {
            throw new Error('Missing required environment variables');
        }

        const { phone_number, spinsleft } = await request.json();

        // Enhanced input validation
        if (!phone_number || typeof phone_number !== 'string' || phone_number.length !== 10) {
            return NextResponse.json(
                { error: 'เบอร์โทรศัพท์ไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        if (typeof spinsleft !== 'number' || spinsleft < 0) {
            return NextResponse.json(
                { error: 'จำนวนรอบหมุนไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        const [result] = await pool.execute<mysql.ResultSetHeader>(
            "UPDATE wp_wprw_roulettewheel SET spinsleft = ? WHERE phone_number = ?",
            [spinsleft, phone_number]
        );

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