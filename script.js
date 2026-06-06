let tasksData = {};
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const task = document.querySelectorAll('.task');
const toggleModalBtb = document.querySelector('#toggle-modal');
const addTaskBtn = document.querySelector('#add-new-task');
const modal = document.querySelector('.modal');
const modalBg = document.querySelector('.bg');
const board = document.querySelector('.board');
const columns = [todo, progress, done];
let dragElement = null;

function addTask(title, desc, column) {
    const div = document.createElement('div');
    
    div.classList.add('task');
    div.setAttribute('draggable', 'true');
    
    div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button class="delete">Delete</button>
    `;
    column.appendChild(div);

    div.addEventListener('drag', (e) => {
        dragElement = div;
    });

    return div;

}

function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector('.right');

        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector('h2').innerText,
                desc: t.querySelector('p').innerText
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasksData));

        count.innerText = tasks.length;

    });
}


if (localStorage.getItem("tasks")) {

    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            addTask(task.title, task.desc, column);
        });


    }
    updateTaskCount();
}


task.forEach(task => {
    task.addEventListener('drag', (e) => {
        dragElement = task;
    })
});


function addDragEventsOnColumn(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add('hover-over');
    });
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove('hover-over');
    });

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", (e) => {
        e.preventDefault();
        column.appendChild(dragElement);
        column.classList.remove('hover-over');

        updateTaskCount();


    });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

toggleModalBtb.addEventListener('click', () => {

    modal.classList.toggle('active');
});

modalBg.addEventListener('click', () => {
    modal.classList.toggle('active');
});

addTaskBtn.addEventListener('click', () => {

    const taskTitle = document.querySelector("#task-title-input").value;
    const taskDesc = document.querySelector("#task-desc-input").value;

    if (taskTitle !== '') {
        
        addTask(taskTitle, taskDesc, todo);
        updateTaskCount();

        modal.classList.remove('active');

        document.querySelector("#task-title-input").value = "";
        document.querySelector("#task-desc-input").value = "";

    }

    else {
        alert('iq over 9000');
    }
});

board.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        const task = e.target.parentElement;
        task.remove();
        updateTaskCount();
    }
});
