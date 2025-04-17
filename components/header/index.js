import { MainPage } from "../../pages/main/index.js";

export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    render() {
        const html = `
            <nav class="navbar navbar-light bg-light">
                <div class="container">
                    <a class="navbar-brand" href="#"><img src="VK.png" width="240" height="40" alt="Логотип"></a>
                    <button class="btn btn-outline-primary" id="home-btn">Домой</button>
                </div>
            </nav>
        `;
        this.parent.insertAdjacentHTML("afterbegin", html);

        document.getElementById("home-btn").addEventListener("click", () => {
            const main = new MainPage(this.parent);
            main.render();
        });
    }
}