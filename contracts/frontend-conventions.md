# Frontend Conventions

สัญญากลางฝั่ง frontend — เบากว่าไฟล์อื่นเพราะ stack นี้ไม่มี framework/design system
ใช้กันความสับสนเรื่องโครงสร้างไฟล์และวิธีเรียก API เท่านั้น

## โครงสร้างไฟล์

```
frontend/
  index.html
  app.js       ← logic ทั้งหมด รวม fetch calls
  style.css
```

## การเรียก API

- เรียกผ่าน `fetch()` ตรงตาม `contracts/api-spec.yaml` เท่านั้น ห้ามเดา endpoint/field
  ที่ไม่มีในสเปก
- Base URL: `http://localhost:3000/api` (ตรงกับที่ backend agent ต้อง serve)
- จัดการ error โดยเช็ค `response.ok` ก่อนทุกครั้ง ถ้าไม่ ok ให้แสดงข้อความสั้นๆ
  ในหน้าเว็บ ไม่ใช่แค่ throw เงียบๆ

## Element ID convention

ให้ backend/reviewer ตรวจสอบง่าย ใช้ id ตามนี้:

- `#todo-list` — container ของรายการ todo ทั้งหมด
- `#todo-form` — form สำหรับเพิ่ม todo ใหม่
- `#todo-title-input`, `#todo-description-input`
- แต่ละ todo item ใช้ `data-todo-id="{id}"` เพื่อ map กลับไปที่ record ใน backend
