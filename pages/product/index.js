import { mockData } from "../../mock/data.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { HeaderComponent } from "../../components/header/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.data = mockData.find(item => item.id == id);
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent);
        header.render();

        this.parent.insertAdjacentHTML('beforeend', `
            <div class="container mt-3">
                <div class="card mb-3">
                    <img src="${this.data.src}" class="card-img-top" alt="${this.data.title}">
                    <div class="card-body">
                        <h5 class="card-title">${this.data.title}</h5>
                        <p class="card-text">${this.data.text}</p>
                    </div>
                </div>
                <button class="btn btn-secondary" id="back-btn">Назад</button>
            </div>
        `);

        document.getElementById("back-btn").addEventListener("click", this.clickBack.bind(this));
    }
}