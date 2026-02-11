# Inventory Mobile Application

React Native application สำหรับแสดง Web Application ผ่าน WebView และเชื่อมต่อกับ RFID Scanner บนอุปกรณ์ iData T2UHF

## Tech Stack

- **Framework**: React Native 0.83
- **Language**: TypeScript
- **Package Manager**: Bun
- **Testing**: Jest + fast-check (Property-Based Testing)
- **WebView**: react-native-webview

## Target Device

- iData T2UHF Android Handheld with UHF RFID Scanner

## Getting Started

### ติดตั้ง Dependencies

```bash
bun install
```

### รันบน Android

```bash
# เริ่ม Metro bundler
bun run start

# รันบน Android (ใน terminal อื่น)
bun run android
```

### รันบน iOS

```bash
# ติดตั้ง CocoaPods dependencies
cd ios && bundle install && bundle exec pod install && cd ..

# รันบน iOS
bun run ios
```

## Testing

### รัน Tests

```bash
bun run test
```

## โครงสร้างโปรเจกต์

```
inventory-mobile/
├── src/
│   ├── services/          # Services (WebView Bridge, RFID Scanner)
│   ├── modules/           # Native Modules
│   └── types/             # TypeScript Types
├── android/               # Android Native Code
├── ios/                   # iOS Native Code
├── __tests__/             # Tests
└── App.tsx                # Main App Component
```

## Features

- แสดง Web Application ผ่าน WebView
- เชื่อมต่อกับ RFID Scanner (iData T2UHF SDK)
- สื่อสารระหว่าง React Native และ Web App ผ่าน WebView Bridge
- จัดการ RFID scanning events

## Development Notes

- ใช้ Bun สำหรับ package management
- RFID Native Module จะถูกพัฒนาใน Task 11
- WebView configuration อยู่ใน Task 10
