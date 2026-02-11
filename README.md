# ระบบ Inventory นับจำนวนสินค้า

ระบบจัดการสินค้าคงคลังที่ประกอบด้วย Web Application และ Mobile Application พร้อมรองรับ RFID scanning

## โครงสร้างโปรเจกต์

```
rfidweb/
├── inventory-web/          # Next.js Web Application
├── inventory-mobile/       # React Native Mobile Application
└── .kiro/specs/           # Specification Documents
```

## Components

### 1. Web Application (inventory-web/)

- **Framework**: Next.js 16 with App Router
- **Runtime**: Bun
- **Features**: 
  - จัดการสินค้า (CRUD operations)
  - Local Storage persistence
  - รองรับ RFID data จาก Mobile App
  - Responsive design

[ดูรายละเอียดเพิ่มเติม](./inventory-web/README.md)

### 2. Mobile Application (inventory-mobile/)

- **Framework**: React Native 0.83
- **Target**: iData T2UHF Android Handheld
- **Features**:
  - แสดง Web App ผ่าน WebView
  - เชื่อมต่อ RFID Scanner
  - WebView Bridge สำหรับการสื่อสาร

[ดูรายละเอียดเพิ่มเติม](./inventory-mobile/README.md)

## Quick Start

### Web Application

```bash
cd inventory-web
bun install
bun run dev
```

เปิดเบราว์เซอร์ที่ http://localhost:3000

### Mobile Application

```bash
cd inventory-mobile
bun install
bun run start
# ใน terminal อื่น: bun run android
```

## Production Deployment

### Web Application

Deploy ไปยัง hosting service (Vercel, Netlify, หรือ server ของคุณ):

```bash
cd inventory-web
bun run build
```

### Mobile Application

1. แก้ไข URL ใน `inventory-mobile/src/config/app.config.ts`:
```typescript
production: {
  WEB_APP_URL: 'https://your-production-url.com',
}
```

2. Build APK:
```bash
cd inventory-mobile/android
./gradlew assembleRelease
```

3. APK จะอยู่ที่: `android/app/build/outputs/apk/release/app-release.apk`

[ดูคู่มือ Deployment แบบละเอียด](./inventory-mobile/DEPLOYMENT.md)

## Development Workflow

1. พัฒนา Web Application ก่อน (Tasks 2-9)
2. พัฒนา Mobile Application (Tasks 10-13)
3. Integration Testing (Task 14)

## Tech Stack

- **Runtime**: Bun
- **Web**: Next.js, TypeScript, Tailwind CSS
- **Mobile**: React Native, TypeScript
- **Testing**: Vitest (Web), Jest (Mobile), fast-check (Property-Based Testing)
- **RFID**: iData T2UHF SDK

## Documentation

- [Requirements](./kiro/specs/inventory-webview-system/requirements.md)
- [Design](./kiro/specs/inventory-webview-system/design.md)
- [Tasks](./kiro/specs/inventory-webview-system/tasks.md)
