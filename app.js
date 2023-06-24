// DOM elements =============================
const todoForm = document.querySelector('#todo-form');
const mainInput = document.querySelector('#todo-form input');
const todoList = document.querySelector('.todos');
const totalTasks = document.querySelector('#total-tasks');
const remainingTasks = document.querySelector('#remaining-tasks');
const completedTasks = document.querySelector('#completed-tasks');

// Functionality
let tasks = JSON.parse(localStorage.getItem('Tasks')) || [];

if (localStorage.getItem('Tasks')) { // if there is a item
    // in the localStorage, we go through each one saved in the 
    // tasks array through map method and we pass that particular
    // task in createTask function
    tasks.map(task => {
        createTask(task);
    })
}

todoList.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();

        e.target.blur(); // blur function simply
        // removes the focus on any element
    }
})

todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-task')) { // if there
        // any element with a class of remove-task (there is
        // only one element with that class here, button and it's childrens)
        const taskId = e.target.closest('li').id; // then we create
        // a task id which is the id of closest list item of
        // the targetted element; parent of that button;
        removeTask(taskId);
    }
})

todoList.addEventListener('input', (e) => {
    const taskId = e.target.closest('li').id;
    updateTask(taskId, e.target);
})

todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // preventing default submission of form;

    let inputValue = mainInput.value;
    if (inputValue === '') { // if there is nothing in the input
        // we skip the submission;
        return;
    }

    let task = {
        id: new Date().getTime(),
        name: inputValue,
        isCompleted: false
    };

    tasks.push(task);
    localStorage.setItem('Tasks', JSON.stringify(tasks));

    createTask(task); // a function we are running here;

    todoForm.reset();
    mainInput.focus();
})

function createTask(task) {
    const taskElement = document.createElement('li');

    taskElement.setAttribute('id', task.id);

    if (task.isCompleted) {
        taskElement.classList.add('complete');
    }

    const taskElemMarkup = `
    <div>
        <input type="checkbox" name="task" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
        <span class='spans' ${!task.isCompleted ? 'contenteditable' : ''}>${task.name}</span>
    </div>
    <button title="Remove '${task.name}' " class="remove-task">
        <svg class="remove-task" width="1.6rem" height="1.6rem" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg" stroke="#A4D0E3">

            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

            <g id="SVGRepo_iconCarrier">
                <path class="remove-task" d="M16 8L8 16M8.00001 8L16 16" stroke="#A4D0E3" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
            </g>

        </svg>
    </button>
    `
    taskElement.innerHTML = taskElemMarkup;

    todoList.appendChild(taskElement);

    countTask();
}

function countTask() {
    const completedTaskArr = tasks.filter((task) => {//filter
        // gonna check if there is a 'task' which is completed
        // and returns that task being pushed to a new array
        // to completedTaskArr variable;
        return task.isCompleted === true;
    })

    totalTasks.innerHTML = tasks.length; // total tasks will be
    // length of the tasks array;
    completedTasks.textContent = completedTaskArr.length;
    // completed task = completedTaskArr.length;
    remainingTasks.textContent = tasks.length - completedTaskArr.length;
}

function removeTask(taskId) {
    tasks = tasks.filter(task => task.id !== parseInt(taskId));
    // skip the id's which doesn't match with the clicked id(taskId);

    localStorage.setItem('Tasks', JSON.stringify(tasks));
    // update the localStorage;

    document.getElementById(taskId).remove();
    //remove the list from the document, which has taskId as id;

    countTask(); // count the tasks again;
}

function updateTask(taskId, el) {
    const task = tasks.find((task) => task.id === parseInt(taskId));
    // this gives us the exact task from tasks array that matches the
    // task id we passes through updateTask function.

    if (el.hasAttribute('contenteditable')) {
        task.name = el.textContent;
    } else {
        const span = el.nextElementSibling;
        const parent = el.closest('li');

        task.isCompleted = !task.isCompleted; // we're doing
        // vice-versa here, if isCompleted is true make it
        // false and other way around.

        if (task.isCompleted) {
            span.removeAttribute('contenteditable');
            parent.classList.add('complete');
        } else {
            span.setAttribute('contenteditable', 'true');
            parent.classList.remove('complete');
        }
    }
    localStorage.setItem('Tasks', JSON.stringify(tasks));

    countTask();
}
