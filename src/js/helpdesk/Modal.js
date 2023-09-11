export default class Modal {
  static confirmDialog(title, text, yesBtnText = 'Ok', noBtnText = 'Отмена') {
    const container = document.createElement('div');
    container.classList.add('modal-container');
    container.innerHTML = `
      <div class="modal">
        <h2 class="modal-title">${title}</h2>
        <div class="modal-body">${text}</div>
        <div class="modal-controls">
          <button class="modal-controls-confirm">${yesBtnText}</button>
          <button class="modal-controls-cancel">${noBtnText}</button>
        </div>
      </div>
    `;
    const confirmButton = container.querySelector('.modal-controls-confirm');
    const cancelButton = container.querySelector('.modal-controls-cancel');
    cancelButton.addEventListener('click', () => container.remove());
    return new Promise((resolve) => {
      confirmButton.addEventListener('click', () => {
        container.remove();
        resolve();
      });
      document.body.appendChild(container);
    });
  }

  static showError(error) {
    const container = document.createElement('div');
    container.classList.add('modal-container');
    container.innerHTML = `
      <div class="modal">
        <h2 class="modal-title">Ошибка</h2>
        <div class="modal-body">${error}</div>
        <div class="modal-controls">
          <button class="modal-controls-confirm">Ok</button>
        </div>
      </div>
    `;
    const confirmButton = container.querySelector('.modal-controls-confirm');
    return new Promise((resolve) => {
      confirmButton.addEventListener('click', () => {
        container.remove();
        resolve();
      });
      document.body.appendChild(container);
    });
  }
}
