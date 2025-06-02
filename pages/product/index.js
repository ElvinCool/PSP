import { ajax } from "../../modules/ajax.js";
import { communitiesUrls } from "../../modules/communitiesUrls.js";
import { HeaderComponent } from "../../components/header/index.js";
import { MainPage } from "../main/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { ProductCardComponent } from "../../components/product-card/index.js";
import { EditPage } from "../edit/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.pageRoot = document.createElement("div");
        this.pageRoot.classList.add("container", "mt-4");
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    getData() {
        ajax.get(communitiesUrls.getCommunitieById(this.id), (data) => {
            this.renderData(data);
        });
    }

    renderData(item) {
        const product = new ProductCardComponent(this.pageRoot);
        product.render(item);

        const editButton = document.createElement("button");
        editButton.className = "btn btn-outline-success btn-lg mt-3";
        editButton.textContent = "Изменить данные";


        editButton.addEventListener("click", () => {
            const editPage = new EditPage(this.parent, item.id);
            editPage.render();
        });

        const cardContainer = product.cardElement || product.pageRoot || product.root;

        if (cardContainer instanceof HTMLElement) {
            cardContainer.appendChild(editButton);
        } else {
            this.pageRoot.appendChild(editButton); 
        }
    }

    render() {
        this.parent.innerHTML = "";

        const header = new HeaderComponent(this.parent);
        header.render();

        this.parent.appendChild(this.pageRoot);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        this.getData();
    }
}
