# คู่มือการ Deploy Mobile App สำหรับ Production

## การเปลี่ยน URL ของ Web App

### วิธีที่ 1: แก้ไขไฟล์ Config (แนะนำ)

1. เปิดไฟล์ `src/config/app.config.ts`
2. แก้ไข `WEB_APP_URL` ใน section `production`:

```typescript
production: {
  WEB_APP_URL: 'https://your-actual-domain.com',
}
```

ตัวอย่าง URLs ที่ใช้ได้:
- Vercel: `https://inventory-web.vercel.app`
- Custom domain: `https://inventory.yourcompany.com`
- Local network: `http://192.168.1.100:3000`
- Cloud server: `https://api.yourserver.com`

3. App จะใช้ URL ที่ถูกต้องโดยอัตโนมัติ:
   - Development mode (`bun run start`): ใช้ `http://localhost:3000`
   - Production build: ใช้ URL ที่คุณกำหนดใน production

### วิธีที่ 2: แก้ไขตรงใน App.tsx (ไม่แนะนำ)

แก้ไขไฟล์ `App.tsx` โดยตรง:

```typescript
const WEB_APP_URL = 'https://your-production-url.com';
```

## การ Build APK สำหรับ Production

### Android

1. **Build Release APK:**
```bash
cd android
./gradlew assembleRelease
```

2. **APK จะอยู่ที่:**
```
android/app/build/outputs/apk/release/app-release.apk
```

3. **ติดตั้งบนอุปกรณ์:**
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### iOS (ถ้ามี)

1. **Build Release:**
```bash
cd ios
pod install
cd ..
bun run ios --configuration Release
```

2. **Archive ผ่าน Xcode:**
   - เปิด `ios/InventoryMobile.xcworkspace` ใน Xcode
   - เลือก Product > Archive
   - Distribute App

## การทดสอบก่อน Deploy

### 1. ทดสอบบน Local Network

แก้ไข config เป็น IP ของเครื่องคุณ:

```typescript
WEB_APP_URL: 'http://192.168.1.XXX:3000'
```

หา IP ของเครื่อง:
- macOS/Linux: `ifconfig | grep inet`
- Windows: `ipconfig`

### 2. ทดสอบ Production URL

1. Deploy web app ไปยัง production server
2. แก้ไข config ให้ชี้ไปที่ production URL
3. Build และทดสอบ APK

## Checklist ก่อน Deploy

- [ ] Web app ถูก deploy และทำงานได้บน production URL
- [ ] แก้ไข `WEB_APP_URL` ใน `src/config/app.config.ts`
- [ ] ทดสอบ WebView โหลด web app ได้
- [ ] ทดสอบ CRUD operations ทำงานได้
- [ ] ทดสอบบนอุปกรณ์จริง (iData T2UHF)
- [ ] Build release APK
- [ ] ติดตั้งและทดสอบ APK บนอุปกรณ์

## Troubleshooting

### WebView ไม่โหลด

1. ตรวจสอบว่า URL ถูกต้อง
2. ตรวจสอบว่า web app ทำงานได้ (เปิดใน browser)
3. ตรวจสอบ network permissions ใน `AndroidManifest.xml`
4. ตรวจสอบ cleartext traffic configuration (สำหรับ HTTP)

### HTTPS Certificate Error

ถ้าใช้ HTTPS แต่มี certificate error:
1. ตรวจสอบว่า SSL certificate ถูกต้อง
2. อาจต้องเพิ่ม network security config

### Local Network ไม่เชื่อมต่อ

1. ตรวจสอบว่าอุปกรณ์อยู่ใน network เดียวกัน
2. ตรวจสอบ firewall settings
3. ใช้ `http://` ไม่ใช่ `https://` สำหรับ local network

## Environment-specific Builds

ถ้าต้องการ build หลาย environment:

1. สร้างไฟล์ config แยก:
   - `app.config.dev.ts`
   - `app.config.staging.ts`
   - `app.config.prod.ts`

2. Import config ที่ต้องการก่อน build

3. หรือใช้ react-native-config สำหรับการจัดการที่ซับซ้อนกว่า
