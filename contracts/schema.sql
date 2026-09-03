-- schema.sql
-- สัญญากลางของโครงสร้างฐานข้อมูล — database agent เป็นเจ้าของไฟล์นี้
-- backend agent อ่านได้อย่างเดียว ห้ามสมมติ column ที่ไม่มีในนี้

CREATE TABLE IF NOT EXISTS todos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT,
    completed   INTEGER NOT NULL DEFAULT 0,   -- 0 = false, 1 = true
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ถ้าต้องเพิ่ม/แก้ column ในอนาคต ให้เพิ่มเป็น ALTER TABLE ต่อท้ายไฟล์นี้
-- (ห้ามแก้ CREATE TABLE เดิมตรงๆ ถ้ามีข้อมูลอยู่แล้วในไฟล์ data.db)
-- ตัวอย่าง:
-- ALTER TABLE todos ADD COLUMN due_date TEXT;
