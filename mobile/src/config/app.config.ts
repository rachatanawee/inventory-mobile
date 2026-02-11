/**
 * Application Configuration
 * 
 * สำหรับ Production:
 * 1. เปลี่ยน WEB_APP_URL เป็น URL ของ production server
 * 2. Build APK ใหม่ด้วยคำสั่ง: cd android && ./gradlew assembleRelease
 * 
 * ตัวอย่าง Production URLs:
 * - Vercel: https://your-app.vercel.app
 * - Custom domain: https://inventory.your-domain.com
 * - Local network: http://192.168.1.100:3000
 */

// กำหนด environment
const ENV = {
  development: {
    WEB_APP_URL: 'http://localhost:3000',
  },
  production: {
    // เปลี่ยน URL นี้เป็น production URL ของคุณ
    WEB_APP_URL: 'https://your-production-url.com',
  },
};

// เลือก environment (เปลี่ยนเป็น 'production' เมื่อต้องการ build production)
const CURRENT_ENV: 'development' | 'production' = __DEV__ ? 'development' : 'production';

export const Config = {
  WEB_APP_URL: ENV[CURRENT_ENV].WEB_APP_URL,
  IS_DEV: __DEV__,
  CURRENT_ENV,
};

export default Config;
