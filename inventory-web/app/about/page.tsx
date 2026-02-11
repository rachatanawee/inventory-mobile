/**
 * About Page
 * Displays application information, version, and credits
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เกี่ยวกับ - Inventory System',
  description: 'ข้อมูลเกี่ยวกับระบบจัดการสินค้าพร้อม RFID Scanner',
};

// Force static rendering
export const dynamic = 'force-static';

export default function AboutPage() {
  // Application metadata
  const appName = 'Inventory System';
  const version = '0.1.0';

  return (
    <div className="min-h-screen bg-[#BBE1FA]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B262C] mb-2">
            {appName}
          </h1>
          <p className="text-[#0F4C75]">
            เวอร์ชัน {version}
          </p>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#0F4C75] mb-4">
            เกี่ยวกับระบบ
          </h2>
          <p className="text-[#1B262C] leading-relaxed mb-4">
            ระบบจัดการสินค้าพร้อม RFID Scanner เป็นแอปพลิเคชันที่ออกแบบมาเพื่อช่วยในการจัดการสินค้าคงคลังอย่างมีประสิทธิภาพ 
            ด้วยการใช้เทคโนโลยี RFID ทำให้สามารถติดตามและจัดการสินค้าได้อย่างรวดเร็วและแม่นยำ
          </p>
          <p className="text-[#1B262C] leading-relaxed">
            ระบบนี้รองรับการใช้งานทั้งบนอุปกรณ์มือถือและคอมพิวเตอร์ 
            ช่วยให้การจัดการสินค้าเป็นไปอย่างสะดวกและง่ายดาย
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#0F4C75] mb-4">
            ฟีเจอร์หลัก
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#3282B8] text-xl flex-shrink-0">✓</span>
              <span className="text-[#1B262C]">เพิ่ม แก้ไข และลบสินค้า</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#3282B8] text-xl flex-shrink-0">✓</span>
              <span className="text-[#1B262C]">เพิ่มและลดจำนวนสินค้าได้อย่างรวดเร็ว</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#3282B8] text-xl flex-shrink-0">✓</span>
              <span className="text-[#1B262C]">ดึงเพื่อรีเฟรชข้อมูล</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#3282B8] text-xl flex-shrink-0">✓</span>
              <span className="text-[#1B262C]">รองรับการใช้งานบน Mobile และ Desktop</span>
            </li>
          </ul>
        </div>

        {/* RFID Capabilities Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#0F4C75] mb-4">
            ความสามารถ RFID
          </h2>
          <p className="text-[#1B262C] leading-relaxed mb-4">
            ระบบรองรับการสแกน RFID tag เพื่อเพิ่มจำนวนสินค้าอัตโนมัติ 
            เมื่อสแกน RFID tag ระบบจะค้นหาสินค้าที่ตรงกับ tag นั้น:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#3282B8] text-xl flex-shrink-0">•</span>
              <span className="text-[#1B262C]">
                หากพบสินค้า ระบบจะเพิ่มจำนวนสินค้าโดยอัตโนมัติ
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#3282B8] text-xl flex-shrink-0">•</span>
              <span className="text-[#1B262C]">
                หากไม่พบสินค้า ระบบจะเปิดฟอร์มเพิ่มสินค้าใหม่พร้อม RFID tag ที่สแกนไว้
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#3282B8] text-xl flex-shrink-0">•</span>
              <span className="text-[#1B262C]">
                รองรับการสื่อสารระหว่าง Web และ Mobile App ผ่าน WebView
              </span>
            </li>
          </ul>
        </div>

        {/* Credits Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#0F4C75] mb-4">
            เครดิต
          </h2>
          <div className="text-[#1B262C] space-y-2">
            <p>
              <span className="font-medium">พัฒนาโดย:</span> Development Team
            </p>
            <p>
              <span className="font-medium">เทคโนโลยี:</span> Next.js, React, TypeScript, Tailwind CSS, Drizzle ORM
            </p>
            <p>
              <span className="font-medium">ฐานข้อมูล:</span> PostgreSQL
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3282B8] text-white rounded-lg hover:bg-[#0F4C75] active:bg-[#1B262C] font-medium transition-colors touch-manipulation"
          >
            <span>←</span>
            <span>กลับไปหน้าหลัก</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
