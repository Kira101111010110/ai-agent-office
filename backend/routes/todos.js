const express = require("express");
const db = require("../db");

const router = express.Router();

function serialize(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: !!row.completed,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM todos ORDER BY id").all();
  res.json(rows.map(serialize));
});

router.post("/", (req, res) => {
  const { title, description } = req.body || {};

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "title is required and must be non-empty" });
  }

  const stmt = db.prepare(
    "INSERT INTO todos (title, description) VALUES (?, ?)"
  );
  const info = stmt.run(title, description ?? null);

  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(serialize(row));
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: "todo not found" });
  }
  res.json(serialize(row));
});

router.put("/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM todos WHERE id = ?").get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "todo not found" });
  }

  const { title, description, completed } = req.body || {};

  if (title !== undefined && (typeof title !== "string" || title.trim().length === 0)) {
    return res.status(400).json({ error: "title must be non-empty when provided" });
  }

  const next = {
    title: title !== undefined ? title : existing.title,
    description: description !== undefined ? description : existing.description,
    completed:
      completed !== undefined ? (completed ? 1 : 0) : existing.completed,
  };

  db.prepare(
    "UPDATE todos SET title = ?, description = ?, completed = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(next.title, next.description, next.completed, req.params.id);

  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(req.params.id);
  res.json(serialize(row));
});

router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM todos WHERE id = ?").run(req.params.id);
  if (info.changes === 0) {
    return res.status(404).json({ error: "todo not found" });
  }
  res.status(204).send();
});

module.exports = router;
