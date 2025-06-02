import { ajax } from "../../modules/ajax.js";
import { communitiesUrls } from "../../modules/communitiesUrls.js";
import { HeaderComponent } from "../../components/header/index.js";
import { MainPage } from "../main/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { ProductCardComponent } from "../../components/product-card/index.js";

export class EditPage {
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
        this.pageRoot.innerHTML = "";
    
        this.cardContainer = document.createElement("div");
        this.pageRoot.appendChild(this.cardContainer);
    
        const product = new ProductCardComponent(this.cardContainer);
        product.render(item);

        const openBtn = this.cardContainer.querySelector('[data-action="open"]');
        if (openBtn) openBtn.remove();
        const deleteBtn = this.cardContainer.querySelector('[data-action="delete"]');
        if (deleteBtn) deleteBtn.remove();
    
        const editBlock = document.createElement("div");
        editBlock.classList.add("mt-4");
    
        const titleInput = document.createElement("input");
        titleInput.className = "form-control mb-2";
        titleInput.value = item.title;
    
        const descInput = document.createElement("textarea");
        descInput.className = "form-control mb-2";
        descInput.value = item.text;
    
        const saveButton = document.createElement("button");
        saveButton.className = "btn btn-primary me-2";
        saveButton.textContent = "Сохранить изменения";
    
        const updateCardButton = document.createElement("button");
        updateCardButton.className = "btn btn-secondary";
        updateCardButton.textContent = "Обновить карточку";
    
        editBlock.appendChild(titleInput);
        editBlock.appendChild(descInput);
        editBlock.appendChild(saveButton);
        editBlock.appendChild(updateCardButton);
        this.pageRoot.appendChild(editBlock);
    
        saveButton.addEventListener("click", () => {
            const updated = {
                ...item,
                title: titleInput.value.trim(),
                text: descInput.value.trim(),
            };
    
            ajax.patch(communitiesUrls.updateCommunitieById(item.id), updated, (res, status) => {
                const existingMsg = this.pageRoot.querySelector(".save-success-msg");
                if (existingMsg) existingMsg.remove();
    
                const successMsg = document.createElement("div");
                successMsg.className = "alert alert-success save-success-msg mt-3";
                successMsg.textContent = "Изменения сохранены";
    
                editBlock.appendChild(successMsg);
    
                setTimeout(() => {
                    successMsg.remove();
                }, 3000);
            });
        });
    
        updateCardButton.addEventListener("click", () => {
            ajax.get(communitiesUrls.getCommunitieById(this.id), (freshData) => {
                this.cardContainer.innerHTML = "";
                const newProduct = new ProductCardComponent(this.cardContainer);
                newProduct.render(freshData);
        
                const openBtn = this.cardContainer.querySelector('[data-action="open"]');
                if (openBtn) openBtn.remove();
                const deleteBtn = this.cardContainer.querySelector('[data-action="delete"]');
                if (deleteBtn) deleteBtn.remove();
            });
        });

        const backSimpleButton = document.createElement("button");
        backSimpleButton.className = "btn btn-outline-primary mb-3 ms-2 mt-2 ";
        backSimpleButton.textContent = "Назад";
        backSimpleButton.addEventListener("click", this.clickBack.bind(this));
        this.pageRoot.appendChild(backSimpleButton);
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
