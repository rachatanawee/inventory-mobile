# เอกสารการออกแบบระบบ (Design Document)

## ภาพรวม (Overview)

ระบบ Inventory นับจำนวนสินค้าประกอบด้วย 3 ส่วนหลัก:

1. **Web Application**: แอปพลิเคชันเว็บที่สร้างด้วย React และ Bun ทำหน้าที่เป็นส่วนหลักในการจัดการสินค้าคงคลัง ออกแบบให้ทำงานได้ทั้งบนเว็บเบราว์เซอร์และใน WebView รับข้อมูล RFID จาก React Native ผ่าน WebView message passing
2. **Mobile Application**: แอปพลิเคชัน React Native ที่แสดง Web Application ผ่าน WebView component และจัดการการสื่อสารกับ RFID scanner
3. **RFID Native Module**: Native module (Java/Kotlin) ที่เชื่อมต่อกับ iData T2UHF RFID SDK เพื่ออ่านข้อมูล RFID tags และส่งไปยัง React Native layer

**อุปกรณ์เป้าหมาย**: iData T2UHF Android Handheld with UHF RFID Scanner

ระบบใช้ Local Storage ในการจัดเก็บข้อมูลสินค้า ทำให้ข้อมูลคงอยู่แม้ปิดแอปพลิเคชัน การออกแบบเน้นความเรียบง่าย ใช้งานง่าย และรองรับการสแกน RFID เพื่อความรวดเร็วในการนับสินค้า

## สถาปัตยกรรม (Architecture)

### Web Application Architecture

```
┌─────────────────────────────────────────┐
│         Web Application (React)         │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │      UI Components Layer          │  │
│  │  - ProductList                    │  │
│  │  - ProductForm                    │  │
│  │  - ProductItem                    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │    State Management Layer         │  │
│  │  - React State/Context            │  │
│  │  - Product State                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     Business Logic Layer          │  │
│  │  - Product Operations             │  │
│  │  - Validation Logic               │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Storage Layer                │  │
│  │  - Local Storage Interface        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Mobile Application Architecture

```
┌─────────────────────────────────────────┐
│   React Native Application              │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │      App Container                │  │
│  │  - Loading State                  │  │
│  │  - Error Handling                 │  │
│  │  - RFID State Management          │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   RFID Scanner Module (Native)    │  │
│  │  - Initialize Scanner             │  │
│  │  - Start/Stop Scanning            │  │
│  │  - Handle RFID Events             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   WebView Bridge Component        │  │
│  │  - Load Web Application           │  │
│  │  - Send RFID Data to Web          │  │
│  │  - Receive Commands from Web      │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         ↕ (Java/Kotlin Bridge)
┌─────────────────────────────────────────┐
│   iData T2UHF SDK (Native Android)      │
│  - UHF RFID Reader API                  │
│  - Tag Reading & Writing                │
│  - Inventory Operations                 │
└─────────────────────────────────────────┘
```

### การไหลของข้อมูล (Data Flow)

**Web Application Flow**:
1. ผู้ใช้โต้ตอบกับ UI Components
2. UI Components เรียกใช้ Business Logic Layer
3. Business Logic ตรวจสอบความถูกต้องของข้อมูล
4. หากข้อมูลถูกต้อง อัปเดต State และบันทึกลง Local Storage
5. State เปลี่ยนแปลง ทำให้ UI Components re-render

**RFID Scanning Flow**:
1. ผู้ใช้กดปุ่มสแกนใน Web Application
2. Web Application ส่ง message ไปยัง React Native ผ่าน WebView
3. React Native เรียกใช้ RFID Native Module
4. Native Module เรียก iData SDK เพื่อเริ่มสแกน
5. เมื่อสแกน RFID tag ได้ Native Module ส่ง event กลับไปยัง React Native
6. React Native ส่ง RFID data (EPC/TID) ไปยัง Web Application ผ่าน WebView
7. Web Application ประมวลผล RFID data และอัปเดตข้อมูลสินค้า

## คอมโพเนนต์และอินเทอร์เฟซ (Components and Interfaces)

### Core Data Types

```typescript
interface Product {
  id: string;
  name: string;
  quantity: number;
  rfidTag?: string;      // RFID EPC/TID (optional)
  createdAt: number;
  updatedAt: number;
}

interface ProductInput {
  name: string;
  quantity: number;
  rfidTag?: string;
}

interface RFIDScanResult {
  epc: string;           // Electronic Product Code
  tid?: string;          // Tag Identifier
  rssi?: number;         // Signal strength
  timestamp: number;
}

interface WebViewMessage {
  type: 'SCAN_RFID' | 'STOP_SCAN' | 'RFID_RESULT' | 'RFID_ERROR';
  payload?: any;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface StorageInterface {
  saveProducts(products: Product[]): void;
  loadProducts(): Product[];
  clearProducts(): void;
}
```

### UI Components

#### 1. App Component
- **หน้าที่**: คอมโพเนนต์หลักที่จัดการ state และ logic ทั้งหมด
- **State**: 
  - `products: Product[]` - รายการสินค้าทั้งหมด
  - `editingProduct: Product | null` - สินค้าที่กำลังแก้ไข
- **Methods**:
  - `addProduct(input: ProductInput): void`
  - `updateProduct(id: string, input: ProductInput): void`
  - `deleteProduct(id: string): void`
  - `increaseQuantity(id: string, amount: number): void`
  - `decreaseQuantity(id: string, amount: number): void`

#### 2. ProductList Component
- **หน้าที่**: แสดงรายการสินค้าทั้งหมด
- **Props**:
  - `products: Product[]`
  - `onEdit: (product: Product) => void`
  - `onDelete: (id: string) => void`
  - `onIncrease: (id: string, amount: number) => void`
  - `onDecrease: (id: string, amount: number) => void`

#### 3. ProductItem Component
- **หน้าที่**: แสดงข้อมูลสินค้าแต่ละรายการพร้อมปุ่มจัดการ
- **Props**:
  - `product: Product`
  - `onEdit: () => void`
  - `onDelete: () => void`
  - `onIncrease: (amount: number) => void`
  - `onDecrease: (amount: number) => void`

#### 4. ProductForm Component
- **หน้าที่**: ฟอร์มสำหรับเพิ่มหรือแก้ไขสินค้า
- **Props**:
  - `initialProduct?: Product`
  - `onSubmit: (input: ProductInput) => void`
  - `onCancel: () => void`
- **State**:
  - `name: string`
  - `quantity: number`
  - `errors: string[]`

### Business Logic Modules

#### ProductValidator
```typescript
class ProductValidator {
  validateName(name: string): ValidationResult
  validateQuantity(quantity: number): ValidationResult
  validateProduct(input: ProductInput): ValidationResult
}
```

**Validation Rules**:
- ชื่อสินค้า: ต้องไม่เป็นค่าว่าง ไม่เป็น whitespace อย่างเดียว
- จำนวนสินค้า: ต้องเป็นตัวเลข ไม่เป็นค่าลบ

#### ProductManager
```typescript
class ProductManager {
  private products: Product[];
  private storage: StorageInterface;
  
  addProduct(input: ProductInput): Product
  updateProduct(id: string, input: ProductInput): Product
  deleteProduct(id: string): void
  getProduct(id: string): Product | undefined
  getAllProducts(): Product[]
  increaseQuantity(id: string, amount: number): Product
  decreaseQuantity(id: string, amount: number): Product
}
```

#### LocalStorageService
```typescript
class LocalStorageService implements StorageInterface {
  private readonly STORAGE_KEY = 'inventory_products';
  
  saveProducts(products: Product[]): void
  loadProducts(): Product[]
  clearProducts(): void
  isAvailable(): boolean
}
```

### Mobile Application Components

#### App Component (React Native)
```typescript
interface AppProps {}

interface AppState {
  isLoading: boolean;
  error: string | null;
  isScanning: boolean;
  lastScannedTag: string | null;
}
```

- **หน้าที่**: จัดการ WebView, RFID scanning และ communication bridge
- **Methods**:
  - `handleLoadStart(): void`
  - `handleLoadEnd(): void`
  - `handleError(error: any): void`
  - `handleWebViewMessage(message: WebViewMessage): void`
  - `sendMessageToWeb(message: WebViewMessage): void`

#### RFID Scanner Module (Native Bridge)

**Java/Kotlin Interface**:
```kotlin
interface RFIDScannerModule {
  fun initialize(): Promise<Boolean>
  fun startScanning(): Promise<Void>
  fun stopScanning(): Promise<Void>
  fun getScannerStatus(): Promise<ScannerStatus>
  
  // Events
  fun onTagScanned(callback: (RFIDScanResult) -> Unit)
  fun onScanError(callback: (Error) -> Unit)
}
```

**React Native Bridge**:
```typescript
interface RFIDScannerBridge {
  initialize(): Promise<boolean>;
  startScanning(): Promise<void>;
  stopScanning(): Promise<void>;
  getScannerStatus(): Promise<'ready' | 'scanning' | 'error'>;
  
  // Event Listeners
  addListener(event: 'onTagScanned', callback: (result: RFIDScanResult) => void): void;
  addListener(event: 'onScanError', callback: (error: Error) => void): void;
  removeAllListeners(event: string): void;
}
```

#### WebView Configuration
```typescript
interface WebViewConfig {
  source: { uri: string };
  style: ViewStyle;
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onError: (error: any) => void;
  onMessage: (event: WebViewMessageEvent) => void;
  javaScriptEnabled: boolean;
  domStorageEnabled: boolean;
  injectedJavaScript?: string;
}
```

#### WebView Bridge Service
```typescript
class WebViewBridgeService {
  private webViewRef: RefObject<WebView>;
  
  sendToWeb(message: WebViewMessage): void
  handleFromWeb(event: WebViewMessageEvent): void
  
  // Specific message handlers
  handleScanRequest(): void
  handleStopScanRequest(): void
  sendRFIDResult(result: RFIDScanResult): void
  sendRFIDError(error: Error): void
}
```

## โมเดลข้อมูล (Data Models)

### Product Model

```typescript
interface Product {
  id: string;           // UUID สำหรับระบุสินค้าแต่ละรายการ
  name: string;         // ชื่อสินค้า (ต้องไม่เป็นค่าว่าง)
  quantity: number;     // จำนวนสินค้าคงเหลือ (ต้อง >= 0)
  rfidTag?: string;     // RFID EPC/TID (optional, สำหรับเชื่อมโยงกับ RFID tag)
  createdAt: number;    // timestamp เมื่อสร้างสินค้า
  updatedAt: number;    // timestamp เมื่ออัปเดตสินค้าล่าสุด
}
```

**Invariants**:
- `id` ต้องไม่ซ้ำกันในระบบ
- `name` ต้องไม่เป็นค่าว่างหรือ whitespace อย่างเดียว
- `quantity` ต้อง >= 0 เสมอ
- `updatedAt` >= `createdAt` เสมอ
- `rfidTag` ถ้ามีค่า ต้องไม่ซ้ำกันในระบบ (unique per product)

### Local Storage Schema

ข้อมูลจัดเก็บใน Local Storage ในรูปแบบ JSON:

```json
{
  "inventory_products": [
    {
      "id": "uuid-string",
      "name": "ชื่อสินค้า",
      "quantity": 10,
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  ]
}
```

### State Management

ใช้ React Context API สำหรับจัดการ state:

```typescript
interface InventoryContextValue {
  products: Product[];
  addProduct: (input: ProductInput) => void;
  updateProduct: (id: string, input: ProductInput) => void;
  deleteProduct: (id: string) => void;
  increaseQuantity: (id: string, amount: number) => void;
  decreaseQuantity: (id: string, amount: number) => void;
  isLoading: boolean;
  error: string | null;
}
```


## คุณสมบัติความถูกต้อง (Correctness Properties)

Property คือลักษณะหรือพฤติกรรมที่ควรเป็นจริงในทุกการทำงานที่ถูกต้องของระบบ เป็นการระบุอย่างเป็นทางการว่าระบบควรทำอะไร Properties ทำหน้าที่เป็นสะพานเชื่อมระหว่างข้อกำหนดที่มนุษย์อ่านได้กับการรับประกันความถูกต้องที่เครื่องจักรตรวจสอบได้

### Core Business Logic Properties

**Property 1: การเพิ่มสินค้าทำให้รายการสินค้ามีจำนวนเพิ่มขึ้น**

*สำหรับ* รายการสินค้าใดๆ และข้อมูลสินค้าที่ถูกต้อง (ชื่อไม่ว่าง จำนวน >= 0) การเพิ่มสินค้าเข้าสู่รายการควรทำให้ความยาวของรายการเพิ่มขึ้น 1 และสินค้าที่เพิ่มควรปรากฏในรายการ

**Validates: Requirements 1.1**

---

**Property 2: ชื่อสินค้าที่เป็น whitespace ถูกปฏิเสธ**

*สำหรับ* string ใดๆ ที่ประกอบด้วย whitespace อย่างเดียว (รวมถึง empty string) การพยายามเพิ่มหรือแก้ไขสินค้าด้วยชื่อดังกล่าวควรถูกปฏิเสธ และรายการสินค้าควรไม่เปลี่ยนแปลง

**Validates: Requirements 1.2, 2.2**

---

**Property 3: จำนวนสินค้าที่ไม่ถูกต้องถูกปฏิเสธ**

*สำหรับ* ค่าใดๆ ที่เป็นค่าลบหรือไม่ใช่ตัวเลข การพยายามเพิ่มหรือแก้ไขสินค้าด้วยจำนวนดังกล่าวควรถูกปฏิเสธ และรายการสินค้าควรไม่เปลี่ยนแปลง

**Validates: Requirements 1.3, 2.3**

---

**Property 4: การแก้ไขสินค้าอัปเดตข้อมูล**

*สำหรับ* สินค้าใดๆ ในรายการ และข้อมูลใหม่ที่ถูกต้อง การแก้ไขสินค้าควรทำให้ข้อมูลของสินค้านั้นเปลี่ยนเป็นข้อมูลใหม่ และ updatedAt timestamp ควรถูกอัปเดต

**Validates: Requirements 2.1**

---

**Property 5: การเพิ่มจำนวนสินค้าเพิ่ม quantity**

*สำหรับ* สินค้าใดๆ และจำนวนที่จะเพิ่ม (amount >= 0) การเพิ่มจำนวนควรทำให้ quantity ของสินค้าเพิ่มขึ้นเท่ากับ amount ที่ระบุ

**Validates: Requirements 3.1**

---

**Property 6: การลดจำนวนสินค้าลด quantity**

*สำหรับ* สินค้าใดๆ และจำนวนที่จะลด (amount >= 0 และ amount <= quantity) การลดจำนวนควรทำให้ quantity ของสินค้าลดลงเท่ากับ amount ที่ระบุ

**Validates: Requirements 3.2**

---

**Property 7: Quantity invariant - ไม่สามารถเป็นค่าลบได้**

*สำหรับ* สินค้าใดๆ การพยายามลดจำนวนสินค้าจนทำให้ quantity < 0 ควรถูกปฏิเสธ และ quantity ของสินค้าควรไม่เปลี่ยนแปลง

**Validates: Requirements 3.3**

---

**Property 8: การลบสินค้าทำให้สินค้าหายจากรายการ**

*สำหรับ* สินค้าใดๆ ในรายการ การลบสินค้าควรทำให้สินค้านั้นไม่ปรากฏในรายการอีกต่อไป และความยาวของรายการลดลง 1

**Validates: Requirements 4.1**

---

**Property 9: การลบสินค้าที่ไม่มีอยู่ให้ error**

*สำหรับ* ID ใดๆ ที่ไม่มีในรายการสินค้า การพยายามลบสินค้าด้วย ID นั้นควรให้ error message และรายการสินค้าควรไม่เปลี่ยนแปลง

**Validates: Requirements 4.3**

---

### UI Rendering Properties

**Property 10: การแสดงข้อมูลสินค้าครบถ้วน**

*สำหรับ* สินค้าใดๆ การ render สินค้านั้นควรให้ output ที่มีชื่อสินค้า จำนวนสินค้า และปุ่มจัดการ (แก้ไข ลบ เพิ่ม ลด)

**Validates: Requirements 5.2**

---

### Data Persistence Properties

**Property 11: การเปลี่ยนแปลงข้อมูลถูกบันทึกลง storage**

*สำหรับ* การดำเนินการใดๆ ที่เปลี่ยนแปลงรายการสินค้า (เพิ่ม แก้ไข ลบ เพิ่มจำนวน ลดจำนวน) หลังจากดำเนินการเสร็จ ข้อมูลใน Local Storage ควรสะท้อนการเปลี่ยนแปลงนั้น

**Validates: Requirements 6.1**

---

**Property 12: Storage round-trip - บันทึกแล้วโหลดได้ข้อมูลเดิม**

*สำหรับ* รายการสินค้าใดๆ การบันทึกรายการลง Local Storage แล้วโหลดกลับมาควรได้รายการสินค้าที่เหมือนเดิม (same products with same data)

**Validates: Requirements 6.2**

---

### Product Model Invariants

**Property 13: Product ID uniqueness**

*สำหรับ* รายการสินค้าใดๆ ไม่ควรมีสินค้าสองรายการที่มี ID เดียวกัน

**Validates: Data Model Invariants**

---

**Property 14: Timestamp consistency**

*สำหรับ* สินค้าใดๆ updatedAt timestamp ควรมีค่ามากกว่าหรือเท่ากับ createdAt timestamp เสมอ

**Validates: Data Model Invariants**

---

### RFID Integration Properties

**Property 15: RFID tag uniqueness**

*สำหรับ* รายการสินค้าใดๆ ไม่ควรมีสินค้าสองรายการที่มี rfidTag เดียวกัน (ถ้า rfidTag ไม่เป็น null/undefined)

**Validates: Requirements 10.3, Data Model Invariants**

---

**Property 16: RFID scan เพิ่มจำนวนสินค้าที่มีอยู่**

*สำหรับ* RFID tag ใดๆ ที่มีสินค้าในระบบอยู่แล้ว เมื่อสแกน tag นั้น quantity ของสินค้าควรเพิ่มขึ้น 1

**Validates: Requirements 10.4**

---

**Property 17: RFID scan สินค้าใหม่เตรียมฟอร์ม**

*สำหรับ* RFID tag ใดๆ ที่ไม่มีสินค้าในระบบ เมื่อสแกน tag นั้น ระบบควรแสดงฟอร์มเพิ่มสินค้าใหม่พร้อมกรอก rfidTag ไว้แล้ว

**Validates: Requirements 10.5**

---

### WebView Communication Properties

**Property 18: Message passing round-trip**

*สำหรับ* message ใดๆ ที่ส่งจาก Web Application ไปยัง React Native ผ่าน WebView bridge ถ้า React Native ส่ง response กลับมา Web Application ควรได้รับ response นั้น

**Validates: Requirements 12.1, 12.2**

---

**Property 19: Message format consistency**

*สำหรับ* message ใดๆ ที่ส่งผ่าน WebView bridge message นั้นควรเป็น valid JSON และมี type field ที่ระบุประเภทของ message

**Validates: Requirements 12.4**

---

## การจัดการข้อผิดพลาด (Error Handling)

### Validation Errors

ระบบจะตรวจสอบความถูกต้องของข้อมูลก่อนดำเนินการใดๆ:

1. **ชื่อสินค้าไม่ถูกต้อง**:
   - Error: "กรุณากรอกชื่อสินค้า"
   - เกิดเมื่อ: ชื่อเป็นค่าว่างหรือ whitespace อย่างเดียว

2. **จำนวนสินค้าไม่ถูกต้อง**:
   - Error: "จำนวนสินค้าต้องเป็นตัวเลขและมากกว่าหรือเท่ากับ 0"
   - เกิดเมื่อ: จำนวนเป็นค่าลบหรือไม่ใช่ตัวเลข

3. **ลดจำนวนเกินที่มี**:
   - Error: "ไม่สามารถลดจำนวนได้ เนื่องจากจำนวนคงเหลือไม่เพียงพอ"
   - เกิดเมื่อ: พยายามลดจำนวนมากกว่าที่มีอยู่

4. **ลบสินค้าที่ไม่มีอยู่**:
   - Error: "ไม่พบสินค้าที่ต้องการลบ"
   - เกิดเมื่อ: พยายามลบสินค้าที่ไม่มีใน ID ในระบบ

### Storage Errors

1. **Local Storage ไม่พร้อมใช้งาน**:
   - Error: "ไม่สามารถบันทึกข้อมูลได้ ระบบจะทำงานโดยไม่บันทึกข้อมูล"
   - เกิดเมื่อ: Local Storage ถูกปิดใช้งานหรือเต็ม
   - การจัดการ: ระบบทำงานต่อแต่ไม่บันทึกข้อมูล

2. **ข้อมูลใน Storage เสียหาย**:
   - Error: "ไม่สามารถโหลดข้อมูลได้ เริ่มต้นด้วยรายการว่าง"
   - เกิดเมื่อ: ข้อมูลใน Local Storage ไม่ใช่ JSON ที่ถูกต้อง
   - การจัดการ: เริ่มต้นด้วยรายการสินค้าว่าง

### WebView Errors

1. **โหลด Web Application ไม่สำเร็จ**:
   - Error: "ไม่สามารถโหลดแอปพลิเคชันได้ กรุณาตรวจสอบการเชื่อมต่อ"
   - เกิดเมื่อ: WebView ไม่สามารถโหลด URL ได้
   - การจัดการ: แสดงข้อความ error และปุ่ม retry

### RFID Scanner Errors

1. **RFID Scanner ไม่พร้อมใช้งาน**:
   - Error: "ไม่สามารถเชื่อมต่อกับ RFID scanner กรุณาตรวจสอบอุปกรณ์"
   - เกิดเมื่อ: ไม่สามารถเริ่มต้น RFID module ได้
   - การจัดการ: ซ่อนปุ่มสแกนและแสดงข้อความแจ้งเตือน

2. **การสแกนล้มเหลว**:
   - Error: "เกิดข้อผิดพลาดในการสแกน กรุณาลองใหม่อีกครั้ง"
   - เกิดเมื่อ: RFID scanner ไม่สามารถอ่าน tag ได้
   - การจัดการ: แสดงข้อความ error และให้ผู้ใช้ลองสแกนใหม่

3. **RFID Tag ซ้ำกัน**:
   - Error: "RFID tag นี้ถูกใช้งานแล้วกับสินค้าอื่น"
   - เกิดเมื่อ: พยายามเพิ่มสินค้าใหม่ด้วย RFID tag ที่มีอยู่แล้ว
   - การจัดการ: ปฏิเสธการเพิ่มและแสดงข้อความ error

### Communication Errors

1. **WebView Bridge ไม่ตอบสนอง**:
   - Error: "ไม่สามารถสื่อสารกับระบบได้ กรุณาลองใหม่อีกครั้ง"
   - เกิดเมื่อ: message ไม่สามารถส่งผ่าน WebView bridge ได้
   - การจัดการ: ลองส่ง message ใหม่ (retry) หรือแสดง error

2. **Message Format ไม่ถูกต้อง**:
   - Error: "ข้อมูลที่ได้รับไม่ถูกต้อง"
   - เกิดเมื่อ: message ที่ได้รับไม่ใช่ valid JSON หรือไม่มี type field
   - การจัดการ: ละเว้น message และ log error

### Error Display Strategy

- ใช้ Toast/Snackbar สำหรับ error ที่ไม่ร้ายแรง (validation errors)
- ใช้ Modal/Alert สำหรับ error ที่ร้ายแรง (storage errors)
- แสดง error message เป็นภาษาไทยที่เข้าใจง่าย
- ให้ข้อมูลที่ช่วยให้ผู้ใช้แก้ไขปัญหาได้

## กลยุทธ์การทดสอบ (Testing Strategy)

### Dual Testing Approach

ระบบจะใช้การทดสอบแบบ 2 รูปแบบที่เสริมกัน:

1. **Unit Tests**: ทดสอบกรณีเฉพาะเจาะจง edge cases และ error conditions
2. **Property-Based Tests**: ทดสอบ properties ที่ต้องเป็นจริงกับ input ทุกแบบ

ทั้งสองแบบจำเป็นและเสริมกันเพื่อให้ครอบคลุมการทดสอบอย่างสมบูรณ์

### Property-Based Testing Configuration

**เครื่องมือที่ใช้**:
- **JavaScript/TypeScript**: fast-check library
- ตั้งค่าให้รันอย่างน้อย 100 iterations ต่อ property test

**การ Tag Property Tests**:
แต่ละ property test ต้องมี comment ที่อ้างอิง property จาก design document:

```typescript
// Feature: inventory-webview-system, Property 1: การเพิ่มสินค้าทำให้รายการสินค้ามีจำนวนเพิ่มขึ้น
test('adding product increases list length', () => {
  // property test implementation
});
```

### Unit Testing Focus

Unit tests ควรเน้นที่:
- **Specific Examples**: ตัวอย่างการใช้งานจริง
- **Edge Cases**: 
  - รายการสินค้าว่าง
  - สินค้าที่มี quantity = 0
  - ชื่อสินค้าที่มีอักขระพิเศษ
  - Local Storage เต็มหรือไม่พร้อมใช้งาน
- **Error Conditions**:
  - Validation errors
  - Storage errors
  - WebView loading errors
- **Integration Points**:
  - การเชื่อมต่อระหว่าง UI และ Business Logic
  - การเชื่อมต่อระหว่าง Business Logic และ Storage
  - การทำงานของ WebView ใน React Native

### Property-Based Testing Focus

Property tests ควรเน้นที่:
- **Universal Properties**: คุณสมบัติที่ต้องเป็นจริงกับ input ทุกแบบ
- **Invariants**: เงื่อนไขที่ต้องคงอยู่เสมอ (เช่น quantity >= 0)
- **Round-trip Properties**: บันทึกแล้วโหลดได้ข้อมูลเดิม
- **Comprehensive Input Coverage**: ทดสอบกับข้อมูลแบบสุ่มหลากหลาย

### Test Organization

```
tests/
├── unit/
│   ├── components/
│   │   ├── ProductList.test.tsx
│   │   ├── ProductForm.test.tsx
│   │   └── ProductItem.test.tsx
│   ├── business-logic/
│   │   ├── ProductValidator.test.ts
│   │   └── ProductManager.test.ts
│   └── storage/
│       └── LocalStorageService.test.ts
├── property/
│   ├── product-operations.property.test.ts
│   ├── validation.property.test.ts
│   ├── storage.property.test.ts
│   └── invariants.property.test.ts
└── integration/
    ├── web-app.integration.test.tsx
    └── mobile-app.integration.test.tsx
```

### Testing Requirements Summary

1. แต่ละ correctness property ต้องมี property-based test 1 ตัว
2. Property tests ต้องรันอย่างน้อย 100 iterations
3. Property tests ต้อง tag ด้วย feature name และ property number
4. Unit tests เสริม property tests ด้วยการทดสอบ edge cases และ examples เฉพาะเจาะจง
5. Integration tests ทดสอบการทำงานร่วมกันของ components

### Example Property Test

```typescript
import fc from 'fast-check';

// Feature: inventory-webview-system, Property 1: การเพิ่มสินค้าทำให้รายการสินค้ามีจำนวนเพิ่มขึ้น
describe('Product Operations Properties', () => {
  test('adding valid product increases list length by 1', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary()),
        fc.record({
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          quantity: fc.nat()
        }),
        (products, newProduct) => {
          const manager = new ProductManager(products);
          const initialLength = manager.getAllProducts().length;
          
          manager.addProduct(newProduct);
          
          const finalLength = manager.getAllProducts().length;
          expect(finalLength).toBe(initialLength + 1);
          
          const addedProduct = manager.getAllProducts()
            .find(p => p.name === newProduct.name);
          expect(addedProduct).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Mobile Testing Strategy

**Web Application Testing**:
- ทดสอบบน browser ปกติ
- ทดสอบบน mobile viewport (responsive design)
- ทดสอบ touch interactions

**React Native Testing**:
- ทดสอบ WebView loading
- ทดสอบ error handling
- ทดสอบบน iOS และ Android simulators/emulators

**Integration Testing**:
- ทดสอบการทำงานของ Web App ใน WebView
- ทดสอบ Local Storage ทำงานใน WebView context
- ทดสอบ performance และ memory usage
