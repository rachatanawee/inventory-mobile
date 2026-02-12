/**
 * Application Configuration
 * 
 * อ่านค่าจาก environment variables (.env, .env.production)
 * 
 * สำหรับ Production:
 * 1. ตั้งค่า WEB_APP_URL ใน .env.production
 * 2. Build APK ด้วย: bun run build:android:prod
 */

import { WEB_APP_URL } from '@env';

// เลือก environment
const CURRENT_ENV: 'development' | 'production' = __DEV__ ? 'development' : 'production';

export const Config = {
  WEB_APP_URL: WEB_APP_URL || 'http://localhost:3000',
  IS_DEV: __DEV__,
  CURRENT_ENV,
};

export default Config;
