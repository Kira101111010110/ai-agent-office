const API_BASE_URL = "http://localhost:3000/api";

const todoForm = document.getElementById("todo-form");
const todoTitleInput = document.getElementById("todo-title-input");
const todoDescriptionInput = document.getElementById("todo-description-input");
const todoList = document.getElementById("todo-list");
const errorMessage = document.getElementById("error-message");

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

async function fetchTodos() {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
      showError("โหลดรายการ todo ไม่สำเร็จ");
      return;
    }
    const todos = await response.json();
    clearError();
    renderTodos(todos);
  } catch (err) {
    showError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  }
}

async function createTodo(title, description) {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (!response.ok) {
      showError("เพิ่ม todo ไม่สำเร็จ");
      return;
    }
    clearError();
    await fetchTodos();
  } catch (err) {
    showError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  }
}

async function updateTodo(id, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      showError("แก้ไข todo ไม่สำเร็จ");
      return;
    }
    clearError();
    await fetchTodos();
  } catch (err) {
    showError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  }
}

async function deleteTodo(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      showError("ลบ todo ไม่สำเร็จ");
      return;
    }
    clearError();
    await fetchTodos();
  } catch (err) {
    showError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  }
}

function renderTodos(todos) {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item";
    item.dataset.todoId = todo.id;
    if (todo.completed) {
      item.classList.add("completed");
    }

    item.appendChild(renderViewMode(todo));
    todoList.appendChild(item);
  });
}

function renderViewMode(todo) {
  const wrapper = document.createElement("div");
  wrapper.className = "todo-view";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    updateTodo(todo.id, { completed: checkbox.checked });
  });

  const textWrap = document.createElement("div");
  textWrap.className = "todo-text";

  const title = document.createElement("span");
  title.className = "todo-title";
  title.textContent = todo.title;

  const description = document.createElement("p");
  description.className = "todo-description";
  description.textContent = todo.description || "";

  textWrap.appendChild(title);
  textWrap.appendChild(description);

  const actions = document.createElement("div");
  actions.className = "todo-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    const item = wrapper.closest(".todo-item");
    item.innerHTML = "";
    item.appendChild(renderEditMode(todo));
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    deleteTodo(todo.id);
  });

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  wrapper.appendChild(checkbox);
  wrapper.appendChild(textWrap);
  wrapper.appendChild(actions);

  return wrapper;
}

function renderEditMode(todo) {
  const wrapper = document.createElement("div");
  wrapper.className = "todo-edit";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = todo.title;

  const descriptionInput = document.createElement("textarea");
  descriptionInput.value = todo.description || "";

  const actions = document.createElement("div");
  actions.className = "todo-actions";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    const title = titleInput.value.trim();
    if (!title) {
      showError("Title ห้ามว่าง");
      return;
    }
    updateTodo(todo.id, {
      title,
      description: descriptionInput.value,
    });
  });

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => {
    const item = wrapper.closest(".todo-item");
    item.innerHTML = "";
    item.appendChild(renderViewMode(todo));
  });

  actions.appendChild(saveButton);
  actions.appendChild(cancelButton);

  wrapper.appendChild(titleInput);
  wrapper.appendChild(descriptionInput);
  wrapper.appendChild(actions);

  return wrapper;
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = todoTitleInput.value.trim();
  const description = todoDescriptionInput.value.trim();

  if (!title) {
    showError("Title ห้ามว่าง");
    return;
  }

  createTodo(title, description).then(() => {
    todoForm.reset();
  });
});

fetchTodos();
