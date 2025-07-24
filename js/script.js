const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const tableBody = document.getElementById('todo-table');
const filterBtn = document.getElementById('filter-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');
const statusFilter = document.getElementById('status-filter');

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = null;

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTable() {
  tableBody.innerHTML = "";

  let filteredTodos = [...todos];

  // Filter tanggal (jika aktif)
  if (currentFilter) {
    filteredTodos = filteredTodos.filter(todo => todo.date === currentFilter);
  }

  // Filter status (jika dipilih)
  const selectedStatus = statusFilter.value;
  if (selectedStatus) {
    filteredTodos = filteredTodos.filter(todo => todo.status === selectedStatus);
  }

  if (filteredTodos.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="empty">No task found</td></tr>`;
    return;
  }

  filteredTodos.forEach((todo, i) => {
    const index = todos.indexOf(todo);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td>${todo.status}</td>
      <td>
        <button onclick="markAsDone(${index})" ${todo.status === 'Sukses' ? 'disabled' : ''}>✔</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (!task || !date) {
    alert("Isi task dan tanggal!");
    return;
  }

  todos.push({ task, date, status: "Pending" });
  saveTodos();

  taskInput.value = "";
  dateInput.value = "";
  currentFilter = null;

  renderTable();
});

function markAsDone(index) {
  todos[index].status = "Sukses";
  saveTodos();
  renderTable();
}


filterBtn.addEventListener("click", () => {
  const date = prompt("Masukkan tanggal untuk filter (yyyy-mm-dd):");
  if (!date) return;
  currentFilter = date;
  renderTable();
});

function deleteTask(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTable();
}

deleteAllBtn.addEventListener("click", () => {
  if (confirm("Hapus semua task?")) {
    todos = [];
    saveTodos();
    currentFilter = null;
    renderTable();
  }
});
statusFilter.addEventListener("change", renderTable);

renderTable(); // panggil saat halaman dibuka
