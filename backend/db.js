const path = require("path");
const fs = require("fs");
const { DatabaseSync } = require("node:sqlite");

const dbPath = path.join(__dirname, "data.db");
const schemaPath = path.join(__dirname, "..", "contracts", "schema.sql");

const db = new DatabaseSync(dbPath);

const schema = fs.readFileSync(schemaPath, "utf8");
db.exec(schema);

module.exports = db;
