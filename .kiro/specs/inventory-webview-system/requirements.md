# เอกสารความต้องการระบบ (Requirements Document)

## บทนำ (Introduction)

ระบบ Inventory นับจำนวนสินค้าเป็นแอปพลิเคชันที่ออกแบบมาเพื่อจัดการสินค้าคงคลังผ่าน Web Application ที่สามารถแสดงผลใน React Native WebView บนอุปกรณ์ iData T2UHF Android Handheld ระบบนี้รองรับการสแกน RFID เพื่อนับสินค้าอย่างรวดเร็ว และช่วยให้ผู้ใช้สามารถเพิ่ม ลด แก้ไข ลบสินค้า และติดตามจำนวนสินค้าคงเหลือได้อย่างมีประสิทธิภาพ

## อภิธานศัพท์ (Glossary)

- **Web_Application**: แอปพลิเคชันเว็บที่สร้างด้วย React และ Bun สำหรับจัดการสินค้าคงคลัง
- **Mobile_Application**: แอปพลิเคชัน React Native ที่แสดง Web_Application ผ่าน WebView และจัดการ RFID scanner
- **Inventory_System**: ระบบหลักที่จัดการข้อมูลสินค้าคงคลัง
- **Product**: สินค้าที่มีข้อมูลประกอบด้วย ชื่อ จำนวน RFID tag และรายละเอียดอื่นๆ
- **Product_List**: รายการสินค้าทั้งหมดในระบบ
- **Quantity**: จำนวนสินค้าคงเหลือ
- **WebView**: คอมโพเนนต์ใน React Native ที่แสดงเนื้อหาเว็บ
- **RFID_Scanner**: โมดูลที่เชื่อมต่อกับ iData T2UHF RFID scanner
- **RFID_Tag**: ข้อมูล RFID ที่ประกอบด้วย EPC (Electronic Product Code) และ TID (Tag Identifier)
- **WebView_Bridge**: กลไกการสื่อสารระหว่าง React Native และ Web Application

## ความต้องการ (Requirements)

### Requirement 1: การจัดการข้อมูลสินค้า

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการเพิ่มสินค้าใหม่เข้าสู่ระบบ เพื่อที่จะสามารถติดตามสินค้าคงคลังได้

#### Acceptance Criteria

1. WHEN ผู้ใช้กรอกข้อมูลสินค้า (ชื่อ จำนวน) และกดปุ่มเพิ่ม THEN THE Inventory_System SHALL สร้างรายการสินค้าใหม่และเพิ่มเข้าสู่ Product_List
2. WHEN ผู้ใช้พยายามเพิ่มสินค้าโดยไม่กรอกชื่อสินค้า THEN THE Inventory_System SHALL ปฏิเสธการเพิ่มและแสดงข้อความแจ้งเตือน
3. WHEN ผู้ใช้พยายามเพิ่มสินค้าโดยกรอกจำนวนเป็นค่าลบหรือไม่ใช่ตัวเลข THEN THE Inventory_System SHALL ปฏิเสธการเพิ่มและแสดงข้อความแจ้งเตือน
4. WHEN สินค้าถูกเพิ่มสำเร็จ THEN THE Inventory_System SHALL แสดงสินค้าใหม่ใน Product_List ทันที

### Requirement 2: การแก้ไขข้อมูลสินค้า

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการแก้ไขข้อมูลสินค้าที่มีอยู่ เพื่อปรับปรุงข้อมูลให้ถูกต้องและเป็นปัจจุบัน

#### Acceptance Criteria

1. WHEN ผู้ใช้เลือกสินค้าและแก้ไขข้อมูล (ชื่อ หรือ จำนวน) THEN THE Inventory_System SHALL อัปเดตข้อมูลสินค้านั้นใน Product_List
2. WHEN ผู้ใช้แก้ไขชื่อสินค้าเป็นค่าว่าง THEN THE Inventory_System SHALL ปฏิเสธการแก้ไขและแสดงข้อความแจ้งเตือน
3. WHEN ผู้ใช้แก้ไขจำนวนสินค้าเป็นค่าลบหรือไม่ใช่ตัวเลข THEN THE Inventory_System SHALL ปฏิเสธการแก้ไขและแสดงข้อความแจ้งเตือน
4. WHEN การแก้ไขสำเร็จ THEN THE Inventory_System SHALL แสดงข้อมูลที่อัปเดตใน Product_List ทันที

### Requirement 3: การเพิ่มและลดจำนวนสินค้า

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการเพิ่มหรือลดจำนวนสินค้า เพื่อสะท้อนการเคลื่อนไหวของสินค้าคงคลัง

#### Acceptance Criteria

1. WHEN ผู้ใช้เลือกสินค้าและกดปุ่มเพิ่มจำนวน THEN THE Inventory_System SHALL เพิ่ม Quantity ของสินค้านั้นตามจำนวนที่ระบุ
2. WHEN ผู้ใช้เลือกสินค้าและกดปุ่มลดจำนวน THEN THE Inventory_System SHALL ลด Quantity ของสินค้านั้นตามจำนวนที่ระบุ
3. WHEN ผู้ใช้พยายามลดจำนวนสินค้าจนเป็นค่าลบ THEN THE Inventory_System SHALL ปฏิเสธการลดและแสดงข้อความแจ้งเตือน
4. WHEN จำนวนสินค้าถูกเปลี่ยนแปลง THEN THE Inventory_System SHALL แสดงจำนวนที่อัปเดตใน Product_List ทันที

### Requirement 4: การลบสินค้า

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการลบสินค้าออกจากระบบ เพื่อจัดการสินค้าที่ไม่ใช้งานแล้ว

#### Acceptance Criteria

1. WHEN ผู้ใช้เลือกสินค้าและกดปุ่มลบ THEN THE Inventory_System SHALL ลบสินค้านั้นออกจาก Product_List
2. WHEN สินค้าถูกลบ THEN THE Inventory_System SHALL อัปเดต Product_List โดยไม่แสดงสินค้าที่ถูกลบ
3. WHEN ผู้ใช้พยายามลบสินค้าที่ไม่มีอยู่ในระบบ THEN THE Inventory_System SHALL แสดงข้อความแจ้งเตือน

### Requirement 5: การแสดงรายการสินค้า

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการดูรายการสินค้าทั้งหมด เพื่อตรวจสอบสินค้าคงคลัง

#### Acceptance Criteria

1. WHEN ผู้ใช้เปิดแอปพลิเคชัน THEN THE Web_Application SHALL แสดง Product_List ที่มีข้อมูลสินค้าทั้งหมด
2. WHEN Product_List มีสินค้า THEN THE Web_Application SHALL แสดงชื่อสินค้า จำนวน และปุ่มจัดการสำหรับแต่ละสินค้า
3. WHEN Product_List ว่างเปล่า THEN THE Web_Application SHALL แสดงข้อความว่าไม่มีสินค้าในระบบ
4. WHEN ข้อมูลสินค้าถูกเปลี่ยนแปลง THEN THE Web_Application SHALL อัปเดตการแสดงผลทันที

### Requirement 6: การจัดเก็บข้อมูล

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการให้ข้อมูลสินค้าถูกบันทึกไว้ เพื่อที่จะไม่สูญหายเมื่อปิดแอปพลิเคชัน

#### Acceptance Criteria

1. WHEN ข้อมูลสินค้าถูกเปลี่ยนแปลง (เพิ่ม แก้ไข ลบ) THEN THE Inventory_System SHALL บันทึกข้อมูลลงใน Local Storage ทันที
2. WHEN ผู้ใช้เปิดแอปพลิเคชันใหม่ THEN THE Inventory_System SHALL โหลดข้อมูลสินค้าจาก Local Storage
3. WHEN Local Storage ไม่มีข้อมูล THEN THE Inventory_System SHALL เริ่มต้นด้วย Product_List ว่างเปล่า

### Requirement 7: การแสดงผลใน WebView

**User Story:** ในฐานะผู้ใช้งานมือถือ ฉันต้องการใช้งานระบบผ่าน React Native app เพื่อความสะดวกในการเข้าถึง

#### Acceptance Criteria

1. WHEN Mobile_Application เปิดขึ้น THEN THE Mobile_Application SHALL โหลด Web_Application ใน WebView
2. WHEN Web_Application ทำงานใน WebView THEN THE Web_Application SHALL แสดงผลและทำงานได้เหมือนกับการเปิดในเว็บเบราว์เซอร์
3. WHEN ผู้ใช้โต้ตอบกับ Web_Application ใน WebView THEN THE Web_Application SHALL ตอบสนองการกระทำของผู้ใช้อย่างถูกต้อง
4. WHEN WebView โหลด Web_Application THEN THE Mobile_Application SHALL แสดง loading indicator จนกว่า Web_Application จะพร้อมใช้งาน

### Requirement 8: การออกแบบ UI ที่เหมาะสมกับ WebView

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการ UI ที่ใช้งานง่ายและเหมาะสมกับหน้าจอมือถือ เพื่อประสบการณ์การใช้งานที่ดี

#### Acceptance Criteria

1. THE Web_Application SHALL ออกแบบ UI ให้รองรับหน้าจอขนาดต่างๆ (Responsive Design)
2. THE Web_Application SHALL ใช้ขนาดตัวอักษรและปุ่มที่เหมาะสมสำหรับการแตะบนหน้าจอสัมผัส
3. THE Web_Application SHALL แสดงผลได้ชัดเจนและอ่านง่ายบนหน้าจอมือถือ
4. WHEN ผู้ใช้หมุนหน้าจออุปกรณ์ THEN THE Web_Application SHALL ปรับการแสดงผลให้เหมาะสมกับทิศทางของหน้าจอ

### Requirement 9: การจัดการข้อผิดพลาด

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการได้รับข้อความแจ้งเตือนที่ชัดเจนเมื่อเกิดข้อผิดพลาด เพื่อเข้าใจและแก้ไขปัญหาได้

#### Acceptance Criteria

1. WHEN เกิดข้อผิดพลาดในการดำเนินการใดๆ THEN THE Inventory_System SHALL แสดงข้อความแจ้งเตือนที่อธิบายข้อผิดพลาดอย่างชัดเจน
2. WHEN ผู้ใช้กรอกข้อมูลไม่ถูกต้อง THEN THE Inventory_System SHALL แสดงข้อความแจ้งเตือนที่ระบุว่าข้อมูลส่วนใดไม่ถูกต้อง
3. WHEN Local Storage ไม่สามารถใช้งานได้ THEN THE Inventory_System SHALL แสดงข้อความแจ้งเตือนและทำงานต่อโดยไม่บันทึกข้อมูล

### Requirement 10: การสแกน RFID

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการสแกน RFID tag เพื่อนับสินค้าอย่างรวดเร็ว โดยไม่ต้องกรอกข้อมูลด้วยตนเอง

#### Acceptance Criteria

1. WHEN ผู้ใช้กดปุ่มสแกน RFID ใน Web_Application THEN THE Mobile_Application SHALL เริ่มการสแกน RFID
2. WHEN RFID tag ถูกสแกน THEN THE Mobile_Application SHALL ส่งข้อมูล RFID (EPC/TID) ไปยัง Web_Application
3. WHEN Web_Application ได้รับข้อมูล RFID THEN THE Inventory_System SHALL ค้นหาสินค้าที่มี RFID tag ตรงกัน
4. WHEN พบสินค้าที่ตรงกับ RFID tag THEN THE Inventory_System SHALL เพิ่มจำนวนสินค้านั้นอัตโนมัติ
5. WHEN ไม่พบสินค้าที่ตรงกับ RFID tag THEN THE Inventory_System SHALL แสดงฟอร์มเพิ่มสินค้าใหม่พร้อมกรอก RFID tag ไว้แล้ว
6. WHEN ผู้ใช้กดปุ่มหยุดสแกน THEN THE Mobile_Application SHALL หยุดการสแกน RFID

### Requirement 11: การเชื่อมต่อ RFID Scanner

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการให้ระบบเชื่อมต่อกับ RFID scanner บนอุปกรณ์ iData T2UHF เพื่อใช้งานฟีเจอร์สแกน

#### Acceptance Criteria

1. WHEN Mobile_Application เริ่มทำงาน THEN THE Mobile_Application SHALL เริ่มต้น RFID scanner module
2. WHEN RFID scanner พร้อมใช้งาน THEN THE Mobile_Application SHALL แจ้งสถานะพร้อมใช้งานไปยัง Web_Application
3. WHEN RFID scanner ไม่พร้อมใช้งาน THEN THE Mobile_Application SHALL แสดงข้อความแจ้งเตือนและซ่อนปุ่มสแกนใน Web_Application
4. WHEN เกิดข้อผิดพลาดในการสแกน RFID THEN THE Mobile_Application SHALL ส่งข้อความ error ไปยัง Web_Application

### Requirement 12: การสื่อสารระหว่าง React Native และ Web

**User Story:** ในฐานะนักพัฒนา ฉันต้องการให้มีการสื่อสารที่เสถียรระหว่าง React Native และ Web Application เพื่อให้ระบบทำงานได้อย่างถูกต้อง

#### Acceptance Criteria

1. WHEN Web_Application ส่ง message ไปยัง React Native THEN THE Mobile_Application SHALL ได้รับและประมวลผล message นั้น
2. WHEN React Native ส่ง message ไปยัง Web_Application THEN THE Web_Application SHALL ได้รับและประมวลผล message นั้น
3. WHEN message ไม่สามารถส่งได้ THEN THE ระบบ SHALL แสดงข้อความแจ้งเตือนและลองส่งใหม่
4. THE ระบบ SHALL ใช้ JSON format สำหรับ message passing ระหว่าง React Native และ Web
