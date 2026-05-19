
const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById("emptyMessage");
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
function addTaskToDOM(text,completed){
    const li = document.createElement('li');
    const span = document.createElement("span");
    span.textContent = text;
    if (completed) span.classList.add('completed');

// click task to delete task
    span.addEventListener('click', () => {
        span.classList.toggle('completed');
        updateTaskInStorage(text, span.classList.contains("completed"));
    });
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "X";
deleteBtn.classList.add("delete-btn");
deleteBtn.addEventListener("click", () => {
    li.remove();
    deleteTask(text);

    updateEmptyState();
});

li.appendChild(span);
li.appendChild(deleteBtn);
taskList.appendChild(li);

}
//save task to localstorage
function saveTask(text,completed){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({text, completed});
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
//delete task - function
function deleteTask(text){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//update task in localstorage
function updateTaskInStorage(text, completed){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = tasks.find(t => t.text === text);
    if (task) task.completed = completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks(){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

function updateEmptyState(){
    const tasks = taskList.children.length;
    if (tasks === 0){
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}