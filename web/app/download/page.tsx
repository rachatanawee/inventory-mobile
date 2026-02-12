/**
 * Download Page
 * Page for downloading the mobile APK on desktop
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'ดาวน์โหลดแอป - Inventory System',
  description: 'ดาวน์โหลดแอปพลิเคชัน Inventory System สำหรับ Android',
};

export const dynamic = 'force-dynamic';

interface BuildInfo {
  version: string;
  versionCode: number;
  buildDate: string;
  buildTimestamp: number;
  fileSize: string;
}

async function getBuildInfo(): Promise<BuildInfo | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'apk', 'build-info.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to read build info:', error);
    return null;
  }
}

export default async function DownloadPage() {
  const buildInfo = await getBuildInfo();

  return (
    <div className="min-h-screen bg-[#BBE1FA]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1B262C] mb-2">
            ดาวน์โหลดแอปพลิเคชัน
          </h1>
          <p className="text-[#0F4C75]">
            Inventory System สำหรับ Android
          </p>
        </div>

        {/* Download Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col items-center gap-6">
            {/* App Icon */}
            <div className="w-24 h-24 bg-[#3282B8] rounded-2xl flex items-center justify-center">
              <span className="text-5xl">📦</span>
            </div>

            {/* App Info */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1B262C] mb-2">
                Inventory System
              </h2>
              <p className="text-[#0F4C75] mb-1">
                เวอร์ชัน {buildInfo?.version || '1.0.0'}
              </p>
              {buildInfo?.buildDate && (
                <p className="text-sm text-gray-600 mb-1">
                  Build: {buildInfo.buildDate}
                </p>
              )}
              <p className="text-sm text-gray-600">
                ขนาดไฟล์: {buildInfo?.fileSize || '~50 MB'}
              </p>
            </div>

            {/* Download Button */}
            <a
              href="/apk/inventory-system.apk"
              download
              className="w-full max-w-md px-8 py-4 bg-[#3282B8] text-white rounded-lg hover:bg-[#0F4C75] active:bg-[#1B262C] font-medium text-center transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                />
              </svg>
              <span>ดาวน์โหลด APK</span>
            </a>

            <p className="text-sm text-gray-500 text-center max-w-md">
              สำหรับอุปกรณ์ Android เท่านั้น
              <br />
              ต้องเปิดใช้งาน &quot;ติดตั้งจากแหล่งที่ไม่รู้จัก&quot; ในการตั้งค่า
            </p>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-[#0F4C75] mb-4">
            วิธีการติดตั้ง
          </h3>
          <ol className="space-y-3 text-[#1B262C]">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#3282B8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <span>ดาวน์โหลดไฟล์ APK โดยกดปุ่มด้านบน</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#3282B8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <span>เปิดไฟล์ APK ที่ดาวน์โหลดมา</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#3282B8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <span>
                หากระบบขอสิทธิ์ &quot;ติดตั้งจากแหล่งที่ไม่รู้จัก&quot; ให้อนุญาต
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#3282B8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                4
              </span>
              <span>กดปุ่ม &quot;ติดตั้ง&quot; และรอจนเสร็จสิ้น</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#3282B8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                5
              </span>
              <span>เปิดแอปและเริ่มใช้งาน</span>
            </li>
          </ol>
        </div>

        {/* System Requirements */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-[#0F4C75] mb-4">
            ความต้องการของระบบ
          </h3>
          <ul className="space-y-2 text-[#1B262C]">
            <li className="flex items-center gap-2">
              <span className="text-[#3282B8]">•</span>
              <span>Android 5.0 (Lollipop) ขึ้นไป</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#3282B8]">•</span>
              <span>พื้นที่ว่างอย่างน้อย 100 MB</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#3282B8]">•</span>
              <span>การเชื่อมต่ออินเทอร์เน็ต</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#3282B8]">•</span>
              <span>อุปกรณ์ RFID Scanner (สำหรับฟีเจอร์สแกน)</span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-[#0F4C75] hover:text-[#3282B8] font-medium transition-colors"
          >
            <span>←</span>
            <span>กลับไปหน้าหลัก</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
