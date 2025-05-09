import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../product/index.js";
import { mockData } from "../../mock/data.js";
import { HeaderComponent } from "../../components/header/index.js";


export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.data = [...mockData];
    }

    addCard() {
        const newCard = { ...this.data[0], id: Date.now() };
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

    render() {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent);
        header.render();

        this.parent.insertAdjacentHTML('beforeend', `
            <div class="container mt-3">
                  <label class="form-label">Поиск по названию:</label>
                  <input class="form-control mb-2" id="search-input" placeholder="Введите название сообщества" />
                  <button class="btn btn-outline-secondary mb-2" id="search-btn">Найти</button>
                </div>
                <div class="container mt-3">
                <button class="btn btn-primary mb-3" id="add-btn">Добавить сообщество</button>
                <div id="card-list" class="d-flex flex-wrap"></div>
            </div>
                <div id="card-list" class="d-flex flex-wrap pl-3"></div>
            </div>
        `);

        const list = document.getElementById("card-list");

        this.data.forEach(item => {
            const card = new ProductCardComponent(list, this.clickCard.bind(this), this.deleteCard.bind(this));
            card.render(item);
        });

        document.getElementById("search-btn").addEventListener("click", () => {
            const query = document.getElementById("search-input").value.toLowerCase();
            const results = this.data.filter(item => item.title.toLowerCase().includes(query));
            const list = document.getElementById("card-list");
            list.innerHTML = '';

            if (results.length === 0) {
                alert("Сообщества не найдены.");
            } else {
                results.forEach(item => {
                    const card = new ProductCardComponent(list, this.clickCard.bind(this), this.deleteCard.bind(this));
                    card.render(item);
                });
            }
        });

        document.getElementById("add-btn").addEventListener("click", () => {
            this.addCard();
        });
    }
}