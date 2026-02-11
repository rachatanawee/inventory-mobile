# แผนการพัฒนา: ระบบ Inventory นับจำนวนสินค้า

## ภาพรวม

แผนการพัฒนานี้ปรับให้สามารถรัน Android app พร้อม web app พื้นฐานได้เร็วที่สุด แบ่งออกเป็น 3 เฟส:

**Phase 1 (MVP)**: Web App พื้นฐาน + Android WebView - รันได้เร็วที่สุด
**Phase 2**: Business Logic + Database + Validation  
**Phase 3**: RFID Integration + Testing + Production Ready

## Tasks

### Phase 1: MVP - Web App + Android WebView

- [x] 1. ตั้งค่าโครงสร้างโปรเจกต์และ dependencies
  - สร้างโครงสร้างโฟลเดอร์สำหรับ web app และ mobile app
  - ตั้งค่า Next.js + Bun สำหรับ web application
  - ตั้งค่า React Native project
  - ติดตั้ง dependencies ที่จำเป็น (React, TypeScript, PostgreSQL, Drizzle ORM)
  - ตั้งค่า testing framework (Vitest สำหรับ web, Jest สำหรับ React Native)
  - สร้าง database schema และ migrations
  - _Requirements: ทุก requirements_

- [x] 2. สร้าง Web App UI พื้นฐาน (MVP)
  - [x] 2.1 สร้าง basic data types
    - สร้าง Product interface พื้นฐาน
    - สร้าง ProductInput type
    - _Requirements: 1.1, 2.1_
  
  - [x] 2.2 สร้าง ProductList component
    - แสดงรายการสินค้าทั้งหมด
    - แสดงข้อความเมื่อรายการว่าง
    - ใช้ mock data ก่อน
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 2.3 สร้าง ProductItem component
    - แสดงข้อมูลสินค้า (ชื่อ, จำนวน)
    - ปุ่มเพิ่ม/ลดจำนวน
    - ปุ่มแก้ไข, ลบ
    - responsive design สำหรับมือถือ
    - _Requirements: 5.2, 8.1, 8.2_
  
  - [x] 2.4 สร้าง ProductForm component
    - ฟอร์มเพิ่ม/แก้ไขสินค้า
    - input fields สำหรับชื่อ, จำนวน
    - basic validation (ไม่ว่าง, จำนวน >= 0)
    - touch-friendly UI
    - _Requirements: 1.1, 2.1, 8.2_
  
  - [x] 2.5 สร้าง main page พร้อม in-memory state
    - ใช้ React useState จัดการ products
    - เชื่อมต่อ components ทั้งหมด
    - ทดสอบ CRUD operations (ยังไม่บันทึก DB)
    - _Requirements: 1.1, 2.1, 3.1, 3.2, 4.1, 5.1_

- [x] 3. สร้าง React Native App + WebView
  - [x] 3.1 สร้าง WebView component wrapper
    - สร้าง InventoryWebView component
    - กำหนด WebView configuration (javaScriptEnabled, domStorageEnabled)
    - implement loading state
    - implement error handling
    - _Requirements: 7.1, 7.2, 7.4_
  
  - [x] 3.2 สร้าง App component หลักของ React Native
    - render InventoryWebView
    - โหลด web app URL (localhost สำหรับ dev)
    - จัดการ loading และ error states
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 3.3 ตั้งค่า Android permissions และ configuration
    - เพิ่ม internet permission
    - กำหนด cleartext traffic สำหรับ localhost
    - ตั้งค่า AndroidManifest.xml
    - _Requirements: 7.1_

- [x] 4. Checkpoint - MVP ทำงานได้
  - รัน web app: `bun run dev` (http://localhost:3000)
  - รัน React Native: `bun run start` และ `bun run android`
  - ทดสอบ WebView แสดง web app ได้
  - ทดสอบ CRUD operations บน web และ mobile
  - ถามผู้ใช้หากมีคำถามหรือปัญหา

### Phase 2: Business Logic + Database

- [x] 5. เชื่อมต่อ Database และ Server Actions
  - [x] 5.1 สร้าง database queries
    - สร้าง queries สำหรับ CRUD operations ด้วย Drizzle
    - getProducts(), getProduct(id), createProduct(), updateProduct(), deleteProduct()
    - _Requirements: 1.1, 2.1, 4.1, 6.1, 6.2_
  
  - [x] 5.2 สร้าง Server Actions
    - สร้าง actions สำหรับ product operations
    - addProductAction(), updateProductAction(), deleteProductAction()
    - increaseQuantityAction(), decreaseQuantityAction()
    - _Requirements: 1.1, 2.1, 3.1, 3.2, 4.1_
  
  - [x] 5.3 เชื่อมต่อ UI กับ Server Actions
    - แทนที่ in-memory state ด้วย database calls
    - ใช้ Server Actions ใน components
    - จัดการ loading states
    - _Requirements: 5.4, 6.1, 6.2_

- [x] 6. สร้าง Validation Logic
  - [x] 6.1 สร้าง ProductValidator class
    - implement validateName() - ตรวจสอบชื่อไม่เป็นค่าว่างหรือ whitespace
    - implement validateQuantity() - ตรวจสอบจำนวนเป็นตัวเลขและ >= 0
    - implement validateProduct() - ตรวจสอบข้อมูลสินค้าทั้งหมด
    - _Requirements: 1.2, 1.3, 2.2, 2.3_
  
  - [x] 6.2 เพิ่ม validation ใน Server Actions
    - validate ก่อนบันทึก database
    - return error messages ที่ชัดเจน
    - _Requirements: 1.2, 1.3, 2.2, 2.3, 9.1, 9.2_
  
  - [x] 6.3 แสดง validation errors ใน UI
    - แสดง error messages ใน ProductForm
    - แสดง toast/alert สำหรับ errors
    - _Requirements: 9.1, 9.2_

- [ ]* 7. Property-Based Tests สำหรับ Business Logic
  - [ ]* 7.1 เขียน property tests สำหรับ validation
    - **Property 2: ชื่อสินค้าที่เป็น whitespace ถูกปฏิเสธ**
    - **Property 3: จำนวนสินค้าที่ไม่ถูกต้องถูกปฏิเสธ**
    - **Validates: Requirements 1.2, 1.3, 2.2, 2.3**
  
  - [ ]* 7.2 เขียน property tests สำหรับ product operations
    - **Property 1: การเพิ่มสินค้าทำให้รายการสินค้ามีจำนวนเพิ่มขึ้น**
    - **Property 4: การแก้ไขสินค้าอัปเดตข้อมูล**
    - **Property 8: การลบสินค้าทำให้สินค้าหายจากรายการ**
    - **Property 9: การลบสินค้าที่ไม่มีอยู่ให้ error**
    - **Validates: Requirements 1.1, 2.1, 4.1, 4.3**
  
  - [ ]* 7.3 เขียน property tests สำหรับ quantity operations
    - **Property 5: การเพิ่มจำนวนสินค้าเพิ่ม quantity**
    - **Property 6: การลดจำนวนสินค้าลด quantity**
    - **Property 7: Quantity invariant - ไม่สามารถเป็นค่าลบได้**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  
  - [ ]* 7.4 เขียน property tests สำหรับ data model invariants
    - **Property 13: Product ID uniqueness**
    - **Property 14: Timestamp consistency**
    - **Validates: Requirements Data Model Invariants**

- [ ] 8. Checkpoint - Business Logic ทำงานถูกต้อง
  - ทดสอบ CRUD operations กับ database จริง
  - ทดสอบ validation ทำงานถูกต้อง
  - ทดสอบ error handling
  - รัน property tests (ถ้ามี)
  - ถามผู้ใช้หากมีคำถามหรือปัญหา

### Phase 3: RFID Integration + Production Ready

- [ ] 9. สร้าง WebView Bridge Communication
  - [x] 9.1 สร้าง WebViewBridgeService ใน React Native
    - implement sendToWeb() - ส่ง message ไปยัง web app
    - implement handleFromWeb() - รับ message จาก web app
    - implement message type handlers (SCAN_RFID, STOP_SCAN)
    - validate message format (JSON with type field)
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [x] 9.2 implement WebView message handler ใน Web App
    - รับ message จาก React Native (RFID_RESULT, RFID_ERROR, scanner status)
    - ส่ง message ไปยัง React Native (SCAN_RFID, STOP_SCAN)
    - _Requirements: 10.2, 12.1, 12.2_
  
  - [ ]* 9.3 เขียน property tests สำหรับ WebView communication
    - **Property 18: Message passing round-trip**
    - **Property 19: Message format consistency**
    - **Validates: Requirements 12.1, 12.2, 12.4**

- [ ] 10. สร้าง RFID Scanner UI
  - [x] 10.1 สร้าง RFIDScanner component
    - ปุ่มเริ่ม/หยุดสแกน RFID
    - แสดงสถานะการสแกน (scanning, idle, error)
    - แสดง RFID tag ที่สแกนล่าสุด
    - ซ่อนปุ่มเมื่อ RFID scanner ไม่พร้อมใช้งาน
    - _Requirements: 10.1, 10.6, 11.3_
  
  - [x] 10.2 implement RFID scan result handler
    - ค้นหาสินค้าด้วย RFID tag
    - ถ้าพบสินค้า: เพิ่มจำนวนอัตโนมัติ
    - ถ้าไม่พบ: แสดงฟอร์มเพิ่มสินค้าใหม่พร้อมกรอก RFID tag
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [ ]* 10.3 เขียน property tests สำหรับ RFID integration
    - **Property 15: RFID tag uniqueness**
    - **Property 16: RFID scan เพิ่มจำนวนสินค้าที่มีอยู่**
    - **Property 17: RFID scan สินค้าใหม่เตรียมฟอร์ม**
    - **Validates: Requirements 10.3, 10.4, 10.5**

- [ ] 11. สร้าง RFID Native Module (Java/Kotlin)
  - [ ] 11.1 ตั้งค่า iData T2UHF SDK
    - เพิ่ม iData SDK library เข้า Android project
    - กำหนด permissions ใน AndroidManifest.xml (RFID access)
    - _Requirements: 11.1_
  
  - [ ] 11.2 สร้าง RFIDScannerModule (Native Module)
    - implement initialize() - เริ่มต้น RFID scanner
    - implement startScanning() - เริ่มสแกน RFID
    - implement stopScanning() - หยุดสแกน RFID
    - implement getScannerStatus() - ตรวจสอบสถานะ scanner
    - implement event emitters (onTagScanned, onScanError)
    - เชื่อมต่อกับ iData SDK API
    - _Requirements: 10.1, 10.6, 11.1, 11.2_
  
  - [ ] 11.3 สร้าง React Native bridge สำหรับ RFID module
    - export RFIDScannerModule ให้ React Native ใช้งานได้
    - implement TypeScript types สำหรับ module
    - implement event listeners (addListener, removeAllListeners)
    - _Requirements: 11.1, 11.2_
  
  - [ ]* 11.4 เขียน unit tests สำหรับ RFID module
    - ทดสอบ initialization
    - ทดสอบ start/stop scanning
    - ทดสอบ error handling
    - _Requirements: 11.2, 11.3, 11.4_

- [ ] 12. เชื่อมต่อ RFID Module กับ React Native App
  - [ ] 12.1 สร้าง RFIDScannerService ใน React Native
    - wrap RFIDScannerModule
    - จัดการ scanner state
    - จัดการ event listeners
    - _Requirements: 10.1, 11.1_
  
  - [ ] 12.2 integrate RFID scanner กับ WebViewBridgeService
    - เมื่อได้รับ SCAN_RFID message: เรียก startScanning()
    - เมื่อได้รับ STOP_SCAN message: เรียก stopScanning()
    - เมื่อ onTagScanned event: ส่ง RFID_RESULT message ไปยัง web
    - เมื่อ onScanError event: ส่ง RFID_ERROR message ไปยัง web
    - _Requirements: 10.1, 10.2, 10.6, 11.4_
  
  - [ ] 12.3 อัปเดต App component หลักของ React Native
    - initialize RFIDScannerService เมื่อ app เริ่มต้น
    - ตรวจสอบสถานะ RFID scanner
    - ส่งสถานะ scanner ไปยัง web app
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ]* 12.4 เขียน integration tests สำหรับ RFID + WebView
    - ทดสอบ message flow: web -> RN -> RFID -> RN -> web
    - ทดสอบ error handling
    - _Requirements: 10.1, 10.2, 11.4, 12.1, 12.2_

- [ ] 13. Checkpoint - RFID Integration ทำงานได้
  - build และรัน React Native app บน Android emulator/device
  - ทดสอบ RFID scanner initialization
  - ทดสอบการสื่อสารระหว่าง web และ React Native (ใช้ mock RFID data)
  - ตรวจสอบว่า tests ทั้งหมดผ่าน
  - ถามผู้ใช้หากมีคำถามหรือปัญหา

- [ ] 14. Integration และ End-to-End Testing
  - [ ] 14.1 ทดสอบบนอุปกรณ์ iData T2UHF จริง
    - deploy web app ไปยัง server หรือใช้ local network
    - build React Native app และติดตั้งบน iData T2UHF
    - ทดสอบ RFID scanning กับ RFID tags จริง
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [ ]* 14.2 เขียน integration tests สำหรับ end-to-end flows
    - ทดสอบ flow: สแกน RFID -> เพิ่มจำนวนสินค้า -> บันทึกลง database
    - ทดสอบ flow: สแกน RFID ใหม่ -> แสดงฟอร์ม -> เพิ่มสินค้า
    - ทดสอบ error scenarios
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 6.1_
  
  - [ ] 14.3 ทดสอบ performance และ usability
    - ทดสอบความเร็วในการสแกน RFID
    - ทดสอบ UI responsiveness บนอุปกรณ์จริง
    - ทดสอบการใช้งานในสภาพแวดล้อมจริง (warehouse, retail)
    - _Requirements: 7.2, 7.3, 8.1, 8.2, 8.3_

- [ ] 15. Documentation และ Deployment
  - [ ] 15.1 สร้าง README และ documentation
    - คู่มือการติดตั้ง web app (ใช้ Bun + Next.js)
    - คู่มือการติดตั้ง React Native app
    - คู่มือการตั้งค่า iData T2UHF RFID scanner
    - คู่มือการใช้งานระบบ
  
  - [ ] 15.2 เตรียม deployment scripts
    - script สำหรับ build web app: `bun run build`
    - script สำหรับ build React Native APK
    - คำแนะนำการ deploy web app (Vercel, local server, หรือ cloud)
  
  - [ ] 15.3 สร้าง troubleshooting guide
    - แก้ปัญหา RFID scanner ไม่ทำงาน
    - แก้ปัญหา WebView ไม่โหลด
    - แก้ปัญหาการสื่อสารระหว่าง web และ React Native
    - แก้ปัญหา database connection

- [ ] 16. Final Checkpoint
  - ตรวจสอบว่าทุก feature ทำงานถูกต้อง
  - ตรวจสอบว่า tests ทั้งหมดผ่าน (unit, property, integration)
  - ทดสอบบนอุปกรณ์ iData T2UHF จริง
  - ถามผู้ใช้หากมีคำถามหรือต้องการปรับปรุงเพิ่มเติม

## หมายเหตุ

- Tasks ที่มี `*` เป็น optional (เกี่ยวกับ testing) สามารถข้ามได้เพื่อ MVP เร็วขึ้น
- แต่ละ task อ้างอิง requirements เฉพาะเจาะจงเพื่อ traceability
- Checkpoints ช่วยให้มั่นใจว่าแต่ละส่วนทำงานถูกต้องก่อนไปต่อ
- Property tests ตรวจสอบ correctness properties ที่กำหนดใน design document
- Unit tests ตรวจสอบ edge cases และ error conditions เฉพาะเจาะจง
- ใช้ Bun สำหรับ web application (runtime และ package manager)
- ใช้ Next.js Server Actions แทน API routes
- ใช้ PostgreSQL + Drizzle ORM สำหรับ database
- ใช้ `bun install`, `bun run`, `bunx --bun` สำหรับคำสั่งต่างๆ

## ลำดับการพัฒนาที่แนะนำ

**สำหรับ MVP เร็วที่สุด:**
1. Task 1 ✅ (เสร็จแล้ว)
2. Task 2 → สร้าง web UI พื้นฐาน
3. Task 3 → สร้าง Android app + WebView
4. Task 4 → Checkpoint: รัน Android app แสดง web app ได้

**หลังจาก MVP:**
5. Task 5-8 → เพิ่ม database + business logic
6. Task 9-13 → เพิ่ม RFID integration
7. Task 14-16 → Testing + Production ready
