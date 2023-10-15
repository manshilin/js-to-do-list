export class Todo {
    static #NAME = 'todo';
    
    // Масив для зберігання завдань
    static #list = [];
    // Лічильник для генерації унікальних ідентифікаторів завдань
    static #count = 0;
    static #saveData = () => {
        localStorage.setItem(this.#NAME, JSON.stringify(
            {list: this.#list, 
            count:  this.#count})
            );
    }
    static #loadData = () => {
        const data = localStorage.getItem(this.#NAME);
        if (data) {
            const {list, count} = JSON.parse(data);
            this.#list = list;
            this.#count = count;
        }
    }


    // Метод для додавання нового завдання
    static createTaskData = (text) => {
        this.#list.push({
            id: ++this.#count, // Збільшуємо лічильник і використовуємо його як ідентифікатор завдання
            text, // Текст завдання
            done: false, // Позначка, що завдання не виконане
        });
    }

    // Змінні для DOM-елементів, які зберігатимуть посилання на різні елементи сторінки
    static #block = null;
    static #input = null;
    static #button = null;
    static #template = null;

    // Метод для ініціалізації програми
    static init = () => {
        // Знаходимо шаблон завдання і DOM-елементи сторінки
        this.#template = document.getElementById("task").content.firstElementChild;
        this.#block = document.querySelector('.task__list');
        this.#input = document.querySelector('.form__input');
        this.#button = document.querySelector('.form__button');
        
        // Додаємо обробник події для кнопки "Додати"
        this.#button.onclick = this.#handleAdd;
        this.#loadData();

        // Відображаємо початковий стан завдань
        this.#render();
    }

    // Метод для додавання завдання при натисканні на кнопку "Додати"
    static #handleAdd = () => {
        const value = this.#input.value;
        if (value === '') return;
        this.createTaskData(this.#input.value);
        this.#input.value = '';
        this.#render(); // Оновлюємо відображення завдань
        this.#saveData();
    }

    // Метод для відображення завдань на сторінці
    static #render = () => {
        this.#block.innerHTML = '';
        if (this.#list.length === 0) {
            this.#block.innerHTML = '<p>Завдань немає</p>';
        } else {
            this.#list.forEach((taskData) => {
                const el = this.createTaskElement(taskData);
                this.#block.append(el);
            });
        }
    }

    // Метод для створення DOM-елемента для завдання
    static createTaskElement = (data) => {
        const el = this.#template.cloneNode(true);
        const [id, text, btnDo, btnCancel] = el.children;
        id.innerText = `${data.id}.`;
        text.innerText = data.text;
        btnCancel.onclick = () => this.handleCancel(data);
        btnDo.onclick = () => this.handleDo(data, btnDo, el);
        if(data.done) {
            el.classList.add('task--done');
            btnDo.classList.remove('task__button--do');
            btnDo.classList.add('task__button--done');

        }
        return el;

    }

    // Метод для позначення завдання як виконаного
    static handleDo = (data, btnDo, el) => {
        const result = this.#toggleDone(data.id);
        if (result === true || result === false) {
            el.classList.toggle('task--done'); // Додаємо або видаляємо клас для позначення завдання як виконаного
            btnDo.classList.toggle('task__button--do'); // Змінюємо стиль кнопки "Do"
            btnDo.classList.toggle('task__button--done'); // Змінюємо стиль кнопки "Done"
            this.#saveData();
        }
    }

    // Метод для зміни стану завдання на виконане або невиконане
    static #toggleDone = (id) => {
        const task = this.#list.find((taskData) => taskData.id === id);
        if (task) {
            task.done = !task.done;
            return task.done; // Повертаємо стан завдання (true або false)
        }
        return null; // Повертаємо null, якщо завдання не знайдено
    }

    // Метод для обробки натискання на кнопку "Видалити"
    static handleCancel = (data) => {
        if (confirm('Ви впевнені, що хочете видалити завдання?')) {
            const result = this.#deleteById(data.id);
            if (result) this.#render(); // Оновлюємо відображення завдань
            this.#saveData();
        }
    }

    // Метод для видалення завдання за його ідентифікатором
    static #deleteById = (id) => {
        this.#list = this.#list.filter((taskData) => taskData.id !== id);
        return true; // Повертаємо true, щоб позначити успішне видалення
    }
}

// Ініціалізуємо програму
Todo.init();

// Додаємо об'єкт `Todo` до глобального об'єкта `window`, щоб можна було використовувати його у консолі браузера
window.todo = Todo;