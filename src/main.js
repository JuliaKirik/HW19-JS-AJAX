class TodoList {
    constructor(el) {
        this.el = el;
        this.list = document.getElementById('list');
        this.url = 'http://localhost:3000/todos';

        el.addEventListener('click', (event) => {
            if (event.target.classList.contains("set-status")) {
                this.update(event);
            } else if (event.target.classList.contains("addItem")) {
                let valueInput = document.getElementById('input').value;
                this.addOrUpdateTodo(this.url, 'POST', new Task(valueInput));
            }
        })
    }

    update(event) {
        let li = event.target.closest('li');
        let id = li.getAttribute('data-id'); 
        let valueInput = li.firstChild.textContent;
        let status = true;
        if (li.classList.contains('done')) {
            status = false;
        }
        this.addOrUpdateTodo(this.url + `/${id}`, 'PUT', new Task(valueInput, status));
    }

    getTodos = function(url) {
        return new Promise (function(resolve, reject) {
            const xhr = new XMLHttpRequest();

            xhr.open('get', url, true);

            xhr.responseType = 'json';

            xhr.onload = function() {
                const status = xhr.status;

                if (status === 201 || status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(status);
                }
            };
            xhr.send()
        });    
    }

    addOrUpdateTodo = function(url, type, task) {
        return new Promise (function(resolve, reject) {
            const xhr = new XMLHttpRequest();

            xhr.open(type, url, true);
            xhr.setRequestHeader(
                'Content-type', 'application/json; charset=utf-8'
            );

            xhr.responseType = 'json';

            xhr.onload = function() {
                const status = xhr.status;
                resolve(xhr.response);
            };

            xhr.onerror = function() {
                reject('Error fetching ' + url);
            }
            xhr.send(JSON.stringify(task));
        });    
    }

    async render() {
        let result = await this.getTodos(this.url)
        try {
            this.list.innerHTML = this.renderList(result);
        } catch (status) {
            console.error('Something went wrong', status);
        }
    }

    renderList(array) {
        let lis = '';
        for (let el of array) {
                if (!el) {
                return;
            }
            let className = "in-progress";
            if (el.complited) {
                className = "done";
            }
            lis += `<li data-id="${el.id}" class="${className}">${el.task}<button class="set-status">Change status</button></li>`;
        }
        return lis;
    }
}

class Task {
    constructor(task, complited = false) {
        this.task = task;
        this.complited = !!complited;
    }
}

let list = document.getElementById('list-wrap');
let todo1 = new TodoList(list);
todo1.render();