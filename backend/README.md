# Todo Backend

Express + SQLite REST API implementing `contracts/api-spec.yaml`.

## Run

```
cd backend
npm install
npm start
```

Server listens on `http://localhost:3000/api`. The SQLite database file
is created automatically at `backend/data.db` from `contracts/schema.sql`
on first run.

## Endpoints

- `GET /api/todos` — list all todos
- `POST /api/todos` — create a todo (`title` required, non-empty)
- `GET /api/todos/:id` — get one todo
- `PUT /api/todos/:id` — partial update (title/description/completed)
- `DELETE /api/todos/:id` — delete a todo
