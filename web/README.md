# Inventory Web Application

Web application สำหรับจัดการสินค้าคงคลัง สร้างด้วย Next.js, TypeScript และ Bun

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Bun
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Testing**: Vitest + fast-check (Property-Based Testing)

## Getting Started

### ติดตั้ง Dependencies

```bash
bun install
```

### รัน Development Server

```bash
bun run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

### Build สำหรับ Production

```bash
bun run build
```

### รัน Production Server

```bash
bun run start
```

## Database

### Setup PostgreSQL

ตรวจสอบว่าติดตั้ง PostgreSQL แล้ว และสร้าง database:

```bash
createdb inventory
```

### Environment Variables

สร้างไฟล์ `.env.local`:

```bash
DATABASE_URL=postgresql://localhost:5432/inventory
```

### Database Commands

```bash
# Generate migration files
bun run db:generate

# Push schema to database (development)
bun run db:push

# Run migrations (production)
bun run db:migrate

# Open Drizzle Studio (database GUI)
bun run db:studio
```

## Testing

### รัน Tests

```bash
bun run test
```

### รัน Tests แบบ Watch Mode

```bash
bun run test:watch
```

### รัน Tests พร้อม UI

```bash
bun run test:ui
```

## โครงสร้างโปรเจกต์

```
inventory-web/
├── app/                    # Next.js App Router
├── components/             # React Components
├── lib/
│   ├── models/            # Data Models & Types
│   ├── services/          # Services (Storage, etc.)
│   ├── validators/        # Validation Logic
│   └── managers/          # Business Logic
├── tests/
│   ├── unit/              # Unit Tests
│   ├── property/          # Property-Based Tests
│   └── integration/       # Integration Tests
└── public/                # Static Assets
```

## Features

- จัดการสินค้า (เพิ่ม แก้ไข ลบ)
- เพิ่ม/ลดจำนวนสินค้า
- รองรับ RFID scanning (ผ่าน React Native WebView)
- บันทึกข้อมูลใน Local Storage
- Responsive Design สำหรับมือถือ
