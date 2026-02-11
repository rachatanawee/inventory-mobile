/**
 * Database Seed Script
 * สร้างข้อมูลตัวอย่างอะไหล่รถยนต์
 */

import { db } from './index';
import { products } from './schema';

const carPartsSeedData = [
  {
    name: 'ยางรถยนต์ Michelin 195/65R15',
    quantity: 24,
    rfidTag: 'TIRE-MICH-195-001',
  },
  {
    name: 'น้ำมันเครื่อง Castrol 10W-40 (1 ลิตร)',
    quantity: 15,
    rfidTag: 'OIL-CAST-10W40-001',
  },
  {
    name: 'แบตเตอรี่ GS 55D23L',
    quantity: 8,
    rfidTag: 'BAT-GS-55D23L-001',
  },
  {
    name: 'ผ้าเบรก หน้า Toyota Vios',
    quantity: 12,
    rfidTag: 'BRAKE-TOY-VIOS-001',
  },
  {
    name: 'ไส้กรองอากาศ Honda City',
    quantity: 20,
    rfidTag: 'FILTER-HON-CITY-001',
  },
  {
    name: 'หลอดไฟหน้า LED H4',
    quantity: 30,
    rfidTag: 'BULB-LED-H4-001',
  },
  {
    name: 'ที่ปัดน้ำฝน Bosch 24 นิ้ว',
    quantity: 18,
    rfidTag: 'WIPER-BOSCH-24-001',
  },
  {
    name: 'สายพานไดนาโม Honda Jazz',
    quantity: 10,
    rfidTag: 'BELT-HON-JAZZ-001',
  },
  {
    name: 'ดิสเบรก หลัง Mazda 3',
    quantity: 6,
    rfidTag: 'DISC-MAZ-3-001',
  },
  {
    name: 'หม้อน้ำ Toyota Camry',
    quantity: 4,
    rfidTag: 'RAD-TOY-CAMRY-001',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // ลบข้อมูลเก่าทั้งหมด (ถ้ามี)
    await db.delete(products);
    console.log('✅ Cleared existing products');

    // เพิ่มข้อมูลใหม่
    await db.insert(products).values(carPartsSeedData);
    console.log(`✅ Inserted ${carPartsSeedData.length} car parts`);

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
