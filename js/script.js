const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const table = document.getElementById('todo-table');
const statusFilter = document.getElementById('status-filter');
const deleteAllBtn = document.getElementById('delete-all-btn');

let todos = [];
let editIndex = null;

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const task = input.value.trim();
  const date = dateInput.value;

  if (!task || !date) {
    alert('Please fill in both fields!');
    return;
  }

  if (editIndex !== null) {
    todos[editIndex] = { task, date };
    editIndex = null;
  } else {
    todos.push({ task, date });
  }

  input.value = '';
  dateInput.value = '';
  renderTable();
});

statusFilter.addEventListener('change', renderTable);

deleteAllBtn.addEventListener('click', function() {
  todos = [];
  renderTable();
});

function renderTable() {
  const filter = statusFilter.value;
  const today = new Date().toISOString().split('T')[0];

  const filtered = todos.filter(todo => {
    const status = todo.date < today ? 'completed' : 'pending';
    if (filter === 'all') return true;
    return status === filter;
  });

  table.innerHTML = '';
  if (filtered.length === 0) {
    table.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-400">No task found</td></tr>`;
    return;
  }

  filtered.forEach((todo, index) => {
    const status = todo.date < today ? 'completed' : 'pending';
    const row = document.createElement('tr');
    row.className = "fade-in";
    row.innerHTML = `
      <td class="p-2 font-semibold text-white">${todo.task}</td>
      <td class="p-2 text-gray-100">${todo.date}</td>
      <td class="p-2 text-lilac capitalize">${status}</td>
      <td class="p-2 flex gap-4">
        <button onclick="editTask(${index})" class="text-blue-400 hover:underline">Edit</button>
        <button onclick="deleteTask(${index})" class="text-red-400 hover:underline">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function deleteTask(index) {
  todos.splice(index, 1);
  renderTable();
}

function editTask(index) {
  const todo = todos[index];
  input.value = todo.task;
  dateInput.value = todo.date;
  editIndex = index;
}
