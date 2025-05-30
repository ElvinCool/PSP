import { ajax } from "../../modules/ajax.js";
import { communitiesUrls } from "../../modules/communitiesUrls.js";
import { HeaderComponent } from "../../components/header/index.js";
import { MainPage } from "../main/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { ProductCardComponent } from "../../components/product-card/index.js";

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

        const editBlock = document.createElement("div");
        editBlock.classList.add("mt-4");

        const titleInput = document.createElement("input");
        titleInput.className = "form-control mb-2";
        titleInput.value = item.title;

        const descInput = document.createElement("textarea");
        descInput.className = "form-control mb-2";
        descInput.value = item.text;

        const saveButton = document.createElement("button");
        saveButton.className = "btn btn-primary";
        saveButton.textContent = "Сохранить изменения";

        editBlock.appendChild(titleInput);
        editBlock.appendChild(descInput);
        editBlock.appendChild(saveButton);
        this.pageRoot.appendChild(editBlock);

        saveButton.addEventListener("click", () => {
            const updated = {
                ...item,
                title: titleInput.value.trim(),
                text: descInput.value.trim(),
            };

            ajax.patch(communitiesUrls.updateCommunitieById(item.id), updated, (res, status) => {
                const existingMsg = this.pageRoot.querySelector(".save-success-msg");
                if (existingMsg) {
                    existingMsg.remove();
                }

                const successMsg = document.createElement("div");
                successMsg.className = "alert alert-success save-success-msg mt-2";
                successMsg.textContent = "Изменения сохранены";

                editBlock.appendChild(successMsg);

                setTimeout(() => {
                    successMsg.remove();
                }, 3000);
            });
        });
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