export class ProductCardComponent {
    constructor(parent, onClick, onDelete) {
        this.parent = parent;
        this.onClick = onClick;
        this.onDelete = onDelete;
    }

    render(item) {
        const html = `
            <div class="card m-2" style="width: 18rem;">
                <img src="${item.src}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.text}</p>
                    <button class="btn btn-primary mb-1" data-id="${item.id}" data-action="open">Открыть сообщество</button>
                    <button class="btn btn-danger" data-id="${item.id}" data-action="delete">Удалить</button>
                </div>
            </div>
        `;
        this.parent.insertAdjacentHTML("beforeend", html);

        const lastCard = this.parent.lastElementChild;
        const openBtn = lastCard.querySelector(`[data-action="open"]`);
        const deleteBtn = lastCard.querySelector(`[data-action="delete"]`);

        openBtn.addEventListener("click", this.onClick);
        deleteBtn.addEventListener("click", this.onClick);
    }
}