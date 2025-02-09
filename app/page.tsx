"use client";

import { useEffect, useState } from "react";

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

export default function Home() {
  const [data1, setData1] = useState<RouletteData[]>([]);
  const [data2, setData2] = useState<RouletteData[]>([]);

  // Thai date formatting utility
  const formatThaiDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    
    const day = thaiDays[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // Convert to Buddhist Era
    const time = date.toLocaleTimeString('th-TH', { hour24: true });
    
    return `วัน${day}ที่ ${dayOfMonth} ${month} ${year} ${time}`;
  };

  // ฟังก์ชันสำหรับดึงข้อมูลจากตารางแรก
  const fetchData1 = () => {
    fetch("/api")
      .then((res) => res.json())
      .then((result: RouletteData[]) => {
        if (Array.isArray(result)) {
          // Sort by timestamp in descending order
          const sortedData = result.sort((a, b) => 
            new Date(b.time_stamp).getTime() - new Date(a.time_stamp).getTime()
          );
          setData1(sortedData);
        } else {
          console.error("API response is not an array:", result);
          setData1([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setData1([]);
      });
  };

  // ฟังก์ชันสำหรับดึงข้อมูลจากตารางที่สอง
  const fetchData2 = () => {
    fetch("/api2")
      .then((res) => res.json())
      .then((result: RouletteData[]) => {
        if (Array.isArray(result)) {
          // Sort by timestamp in descending order
          const sortedData = result.sort((a, b) => 
            new Date(b.time_stamp).getTime() - new Date(a.time_stamp).getTime()
          );
          setData2(sortedData);
        } else {
          console.error("API response is not an array:", result);
          setData2([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setData2([]);
      });
  };

  // โหลดข้อมูลครั้งแรก
  useEffect(() => {
    fetchData1();
    fetchData2();
  }, []);

  // แยกฟังก์ชันรีเฟรช
  const handleRefreshTable1 = () => {
    fetchData1();
  };

  const handleRefreshTable2 = () => {
    fetchData2();
  };

  return (
    <div className="p-6 max-w-[1920px] mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        🏆 ตารางข้อมูล Roulette
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1 */}
        <div className="h-full">
          <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-700">JK</h2>
            <button
              onClick={handleRefreshTable1}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-2 transition-colors duration-200"
            >
              <span>🔄</span>
              รีเฟรชข้อมูล
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    📞 เบอร์โทรศัพท์
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    🎟 รหัสคูปอง
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    🔄 รอบหมุนที่เหลือ
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    🌐 IP Address
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    🍪 Cookie
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    📅 วันที่
                  </th>
                </tr>
              </thead>
              <tbody>
                {data1.length > 0 ? (
                  data1.map((row: RouletteData, index: number) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">{row.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {row.phone_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                        {row.coupon_code}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-semibold ${
                          row.spinsleft > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {row.spinsleft}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {row.ip}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                        {row.cookie}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatThaiDateTime(row.time_stamp)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center px-6 py-10 text-gray-500 text-lg"
                    >
                      ❌ ไม่มีข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2 */}
        <div className="h-full">
          <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-700">BK</h2>
            <button
              onClick={handleRefreshTable2}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-2 transition-colors duration-200"
            >
              <span>🔄</span>
              รีเฟรชข้อมูล
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    📞 เบอร์โทรศัพท์
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    🎟 รหัสคูปอง
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    🔄 รอบหมุนที่เหลือ
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    🌐 IP Address
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    🍪 Cookie
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    📅 วันที่
                  </th>
                </tr>
              </thead>
              <tbody>
                {data2.length > 0 ? (
                  data2.map((row: RouletteData, index: number) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">{row.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {row.phone_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                        {row.coupon_code}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-semibold ${
                          row.spinsleft > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {row.spinsleft}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {row.ip}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                        {row.cookie}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatThaiDateTime(row.time_stamp)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center px-6 py-10 text-gray-500 text-lg"
                    >
                      ❌ ไม่มีข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}