
const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById("emptyMessage");
const historyList = document.getElementById("historyList");
const trashList = document.getElementById("trashList");
//Load tasks to localstorage

loadTasks();
updateEmptyState();

addBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    addTaskToDOM(taskText, false);
    saveTask(taskText, false);

    updateEmptyState();

    taskInput.value = "";
});
//Add to DOM
function addTaskToDOM(text, completed) {
    const li = document.createElement('li');
    li.classList.add("task-item");
    const span = document.createElement("span");
    span.textContent = text;
    if (completed) span.classList.add('completed');

    // click task to delete task
    span.addEventListener('click', () => {

        completedTasks++;

        addToHistory(text);

        li.remove();

        deleteTask(text);

        updateStats();
        updateEmptyState();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {

        addToTrash(text);

        li.remove();

        deleteTask(text);

        updateEmptyState();
});

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

}
//save task to localstorage
function saveTask(text, completed) {
    const tasks = loadFromStorage("tasks");
    tasks.push({ text, completed });
    saveToStorage("tasks", tasks);
}
//delete task - function
function deleteTask(text) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//update task in localstorage
function updateTaskInStorage(text, completed) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = tasks.find(t => t.text === text);
    if (task) task.completed = completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

function updateEmptyState() {
    const tasks = taskList.children.length;
    if (tasks === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}
function addToHistory(text) {
    const currentDate = getCurrentDate();
    let dailySection = document.getElementById(currentDate);
    if (!dailySection) {
        dailySection = document.createElement("div");
        dailySection.id = currentDate;

        const otsikko = document.createElement("h3");
        otsikko.textContent = currentDate;

        const ul = document.createElement("ul");
        dailySection.appendChild(otsikko);
        dailySection.appendChild(ul);
        historyList.appendChild(dailySection);
    }
    const ul = dailySection.querySelector("ul");

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = "✓ " + text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
        const confirmed = confirm("Delete this history task");
        if (confirmed) {
            li.remove();
        }
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    ul.appendChild(li);
}
function getCurrentDate() {
    const today = new Date();
    return today.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    });
}
function addToTrash(text) {

    const li = document.createElement("li");
    li.classList.add("history-item");

    const span = document.createElement("span");
    span.textContent = "🗑 " + text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {

        const confirmed = confirm("Delete this trash task permanently?");

        if (confirmed) {
            li.remove();
        }
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    trashList.appendChild(li);
}

function saveToStorage(key, data) {
    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}

function loadFromStorage(key) {
    return JSON.parse(
        localStorage.getItem(key)
    ) || [];
}