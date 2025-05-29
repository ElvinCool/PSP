import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import { ajax } from "../../modules/ajax.js";
import { communitiesUrls } from "../../modules/communitiesUrls.js";
import { HeaderComponent } from "../../components/header/index.js";

function concatenate(arr, separator = ', ') {
    if (!Array.isArray(arr)) throw new TypeError("Ожидается массив");
    return arr.join(separator);
}

function moveElement(arr, from, to) {
    if (!Array.isArray(arr)) throw new TypeError("Первый аргумент должен быть массивом");
    if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return arr;
    const newArr = [...arr];
    const [item] = newArr.splice(from, 1);
    newArr.splice(to, 0, item);
    return newArr;
}

function diff(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        console.error("Ожидаются два массива в качестве аргументов.");
        return [];
    }
    const result = [];
    arr1.forEach(item => {
        if (!arr2.includes(item)) {
            result.push(item);
        }
    });
    return result;
}

function isPalindrom1(str) {
    if (typeof str !== 'string' && typeof str !== 'number') return false;
    const normalized = String(str).toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
    return normalized === normalized.split('').reverse().join('');
}

function isPalindrom2(str) {
    if (typeof str !== 'string' && typeof str !== 'number') return false;
    const s = String(str).toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
    for (let i = 0; i < s.length / 2; i++) {
        if (s[i] !== s[s.length - 1 - i]) return false;
    }
    return true;
}

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.data = [];
    }

    getData() {
        ajax.get(communitiesUrls.getCommunities(), (data) => {
            this.renderData(data);
        });
    }

    renderData(items) {
        this.data = items;
        this.render();
    }

    deleteCard(id) {
        ajax.delete(communitiesUrls.removeCommunitieById(id), () => {
            this.data = this.data.filter(card => card.id != id);
            this.render();
        });
    }
    
    showAddCardForm() {
        if (document.getElementById("new-title")) return;
    
        const formContainer = document.createElement("div");
        formContainer.id = "new-card-form"; // Уникальный ID
        formContainer.classList.add("card", "p-3", "mb-3");
    
        formContainer.innerHTML = `
            <div class="mb-2">
                <label class="form-label">Название:</label>
                <input type="text" class="form-control" id="new-title" placeholder="Название сообщества" />
            </div>
            <div class="mb-2">
                <label class="form-label">Участники (через запятую):</label>
                <input type="text" class="form-control" id="new-participants" placeholder="Участник 1, Участник 2" />
            </div>
            <div class="mb-2">
                <label class="form-label">Описание:</label>
                <textarea class="form-control" id="new-description" placeholder="Описание сообщества"></textarea>
            </div>
            <div class="mb-2">
                <label class="form-label">URL картинки:</label>
                <input type="text" class="form-control" id="new-image-url" placeholder="https://example.com/image.jpg" />
            </div>
            <button type="button" class="btn btn-success" id="submit-new-card">Создать</button>
        `;
    
        const container = document.querySelector(".container.mt-3");
        container.insertBefore(formContainer, container.firstChild);
    
        formContainer.querySelector("#submit-new-card").addEventListener("click", (event) => {
            event.preventDefault();
            const title = document.getElementById("new-title").value.trim();
            const participantsInput = document.getElementById("new-participants").value;
            const description = document.getElementById("new-description").value.trim();
            const imageUrl = document.getElementById("new-image-url").value.trim();
    
            if (!title || !description || !imageUrl.startsWith("http")) {
                alert("Заполните корректно все поля.");
                return;
            }
    
            const participants = participantsInput.split(",").map(p => p.trim()).filter(Boolean);
            const newCard = { title, participants, src: imageUrl, text: description };
    
            ajax.post(communitiesUrls.createCommunitie(), newCard, (createdCard, status) => {
                    this.data.unshift(createdCard);
                    const successMessage = document.createElement("div");
                    successMessage.className = "alert alert-success";
                    successMessage.textContent = "Новое сообщество успешно создано!";
                    const mainContainer = document.querySelector(".container.mt-3");
                    mainContainer.parentNode.insertBefore(successMessage, mainContainer);

                    setTimeout(() => {
                        successMessage.remove();
                    }, 3000);
                    formContainer.remove();
                    this.render();
            });
        });
    }

    clickCard(e) {
        const id = e.target.dataset.id;
        const action = e.target.dataset.action;

        if (action === "open") {
            const productPage = new ProductPage(this.parent, id);
            productPage.render();
        } else if (action === "delete") {
            this.deleteCard(id);
        }
    }

    renderWithData(data) {
        const originalData = this.data;
        this.data = data;
        this.render();
        this.data = originalData;
    }

    render() {
        this.parent.innerHTML = "";

        const header = new HeaderComponent(this.parent);
        header.render();

        this.parent.insertAdjacentHTML("beforeend", `
            <div class="container mt-3">
                <label class="form-label">Поиск по названию:</label>
                <input class="form-control mb-3" id="search-input" placeholder="Введите название сообщества" />
                <button class="btn btn-outline-secondary mb-2" id="search-btn">Найти</button>
            </div>
            <div class="container mt-3">
                <button class="btn btn-primary mb-3" id="add-btn">Добавить сообщество</button>
                <div id="card-list" class="d-flex flex-wrap"></div>
            </div>
        `);

        const list = document.getElementById("card-list");

        if (!this.data || this.data.length === 0) {
            this.getData();
            return;
        }

        this.data.forEach((item, index) => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("m-2", "p-3", "bg-white");

            const card = new ProductCardComponent(wrapper, this.clickCard.bind(this), this.deleteCard.bind(this));
            card.render(item);

            const actionArea = wrapper.querySelector(".card-body, .card-footer, .actions") || wrapper;

            const moveControls = document.createElement("div");
            moveControls.classList.add("mt-2", "d-flex", "gap-2");

            const upBtn = document.createElement("button");
            upBtn.className = "btn btn-sm btn-outline-primary";
            upBtn.textContent = "🔼";
            upBtn.dataset.index = index;
            upBtn.dataset.dir = "up";

            const downBtn = document.createElement("button");
            downBtn.className = "btn btn-sm btn-outline-primary";
            downBtn.textContent = "🔽";
            downBtn.dataset.index = index;
            downBtn.dataset.dir = "down";

            moveControls.appendChild(upBtn);
            moveControls.appendChild(downBtn);

            const showBtn = document.createElement("button");
            showBtn.className = "btn btn-sm btn-outline-primary";
            showBtn.textContent = "Показать участников";

            const compareBtn = document.createElement("button");
            compareBtn.className = "btn btn-sm btn-outline-secondary";
            compareBtn.textContent = "Сравнить участников";

            const editTitleBtn = document.createElement("button");
            editTitleBtn.className = "btn btn-sm btn-outline-primary";
            editTitleBtn.textContent = "✏️ Изменить название";

            const showControls = document.createElement("div");
            showControls.classList.add("mt-2", "d-flex", "gap-2", "flex-wrap");
            showControls.appendChild(moveControls);
            showControls.appendChild(showBtn);
            showControls.appendChild(compareBtn);
            showControls.appendChild(editTitleBtn); 


            const palindromeBtn = document.createElement("button");
            palindromeBtn.className = "btn btn-sm btn-outline-dark";
            palindromeBtn.textContent = "Палиндром?";
            showControls.appendChild(palindromeBtn);

            palindromeBtn.addEventListener("click", () => {
                const title = item.title;
                const result1 = isPalindrom1(title);
                const result2 = isPalindrom2(title);
                alert(`Проверка названия сообщества "${title}":
Метод 1: ${result1 ? "Палиндром" : "Не палиндром"}
Метод 2: ${result2 ? "Палиндром" : "Не палиндром"}`);
            });

            actionArea.appendChild(showControls);

            const detailsBlock = document.createElement("div");
            detailsBlock.style.display = "none";
            detailsBlock.classList.add("mt-2", "p-2", "bg-light", "rounded", "border");

            const participantsStr = concatenate(item.participants || [], ", ");
            detailsBlock.innerHTML = `<div><strong>Участники:</strong> ${participantsStr}</div>`;

            actionArea.appendChild(detailsBlock);


            showBtn.addEventListener("click", () => {
                const isVisible = detailsBlock.style.display === "block";
                detailsBlock.style.display = isVisible ? "none" : "block";
                showBtn.textContent = isVisible ? "Показать участников" : "Скрыть участников";
            });

            compareBtn.addEventListener("click", () => {
                const otherCard = this.data.find(card => card.id !== item.id);
                if (otherCard) {
                    const diffParticipants = diff(item.participants, otherCard.participants);
                    alert(`Участники, которые есть в этом сообществе, но нет в другом:\n${concatenate(diffParticipants)}`);
                }
            });

            editTitleBtn.addEventListener("click", () => {
                const titleElem = wrapper.querySelector(".card-title"); // или другой селектор заголовка
                if (!titleElem) return;
            
                // Создаем input с текущим значением
                const input = document.createElement("input");
                input.type = "text";
                input.value = item.title;
                input.className = "form-control form-control-sm"; // bootstrap классы для стиля (по желанию)
            
                // Заменяем заголовок на input
                titleElem.replaceWith(input);
                input.focus();
            
                // Функция сохранения нового названия
                function saveTitle() {
                    const newTitle = input.value.trim();
                    if (!newTitle || newTitle === item.title) {
                        // если пустое или не изменилось, вернуть исходный заголовок
                        input.replaceWith(titleElem);
                        return;
                    }
                    const updatedItem = { ...item, title: newTitle };
            
                    ajax.patch(communitiesUrls.updateCommunitieById(item.id), updatedItem, (data, status) => {
                        this.data = this.data.map(card => card.id === item.id ? updatedItem : card);
                        this.render();
                    });
                }
            
                input.addEventListener("blur", saveTitle);
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        input.blur();
                    }
                });
            });

            list.appendChild(wrapper);
        });

        list.querySelectorAll('button[data-dir]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const dir = e.target.dataset.dir;
                const newIndex = dir === "up" ? index - 1 : index + 1;

                if (newIndex >= 0 && newIndex < this.data.length) {
                    this.data = moveElement(this.data, index, newIndex);
                    this.render();
                }
            });
        });

        document.getElementById("search-btn").addEventListener("click", () => {
            const query = document.getElementById("search-input").value.toLowerCase();
            const results = this.data.filter(item => item.title.toLowerCase().includes(query));
            if (results.length === 0) {
                alert("Сообщества не найдены.");
            } else {
                this.renderWithData(results);
            }
        });

        document.getElementById("add-btn").addEventListener("click", () => {
            this.showAddCardForm();
        });
    }
}