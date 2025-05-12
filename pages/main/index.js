import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import { mockData } from "../../mock/data.js";
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
        this.data = [...mockData];
    }

    addCard() {
        const newCard = {
            ...this.data[0],
            id: Date.now(),
            title: "Новое сообщество",
            participants: ["Новый участник"]
        };
        this.data.unshift(newCard);
        this.render();
    }

    deleteCard(id) {
        this.data = this.data.filter(card => card.id != id);
        this.render();
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

            const showControls = document.createElement("div");
            showControls.classList.add("mt-2", "d-flex", "gap-2", "flex-wrap");
            showControls.appendChild(moveControls);
            showControls.appendChild(showBtn);
            showControls.appendChild(compareBtn);

            
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
            this.addCard();
        });
    }
}