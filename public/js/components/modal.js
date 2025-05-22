class Modal {
  constructor() {
    this.modal = null;
    this.createModal();
  }

  createModal() {
    this.modal = document.createElement("div");
    this.modal.className = "modal";
    this.modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title"></h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-content"></div>
      </div>
    `;

    this.modal.querySelector(".modal-close").onclick = () => this.hide();
    this.modal.querySelector(".modal-overlay").onclick = () => this.hide();

    document.body.appendChild(this.modal);
  }

  show(title, content) {
    this.modal.querySelector(".modal-title").textContent = title;
    this.modal.querySelector(".modal-content").innerHTML = content;
    this.modal.classList.add("show");
  }

  hide() {
    this.modal.classList.remove("show");
  }
}
