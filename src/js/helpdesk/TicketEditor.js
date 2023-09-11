import API from '../api';

export default class TicketEditor {
  #resolver;

  static get markup() {
    return `
      <form class="ticket-editor-form">
        <h2 class="ticket-editor-title"></h2>
        <div class="ticket-editor-field">
          <label for="ticketName" class="ticket-editor-name_label">Описание</label>
          <input required name="ticketName" class="ticket-editor-name_input">
        </div>
        <div class="ticket-editor-field">
          <label for="ticketDescription" class="ticket-editor-description_label">Полное описание</label>
          <textarea name="ticketDescription" class="ticket-editor-description_input"></textarea>
        </div>
        <div class="ticket-editor-controls">
          <button type="button" class="ticket-editor-controls-cancel_button">Отмена</button>
          <button type="submit" class="ticket-editor-controls-confirm_button">Ok</button>
        </div>
      </form>
    `;
  }

  static get selector() {
    return '.ticket-editor';
  }

  static get selectorTitle() {
    return '.ticket-editor-title';
  }

  static get selectorForm() {
    return '.ticket-editor-form';
  }

  static get selectorNameInput() {
    return '.ticket-editor-name_input';
  }

  static get selectorDescriptionInput() {
    return '.ticket-editor-description_input';
  }

  static get selectorCancelButton() {
    return '.ticket-editor-controls-cancel_button';
  }

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('ticket-editor');
    this.container.innerHTML = TicketEditor.markup;

    this.close = this.close.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.elTitle = this.container.querySelector(TicketEditor.selectorTitle);
    this.elCancelButton = this.container.querySelector(TicketEditor.selectorCancelButton);
    this.elNameInput = this.container.querySelector(TicketEditor.selectorNameInput);
    this.elDescriptionInput = this.container.querySelector(TicketEditor.selectorDescriptionInput);
    this.elForm = this.container.querySelector(TicketEditor.selectorForm);

    this.registerEvents();
  }

  registerEvents() {
    this.elForm.addEventListener('submit', this.onSubmit);
    this.elCancelButton.addEventListener('click', this.onCancel);
  }

  onSubmit(event) {
    event.preventDefault();
    const data = {
      name: this.elNameInput.value,
      description: this.elDescriptionInput.value,
    };
    this.#resolver(data);
    this.close();
  }

  onCancel() {
    this.close();
  }

  open(title, id) {
    this.elTitle.textContent = title;
    return new Promise((resolve, reject) => {
      this.#resolver = resolve;
      if (id) {
        API.getTicketById(id).then((data) => {
          this.elNameInput.value = data.name;
          this.elDescriptionInput.value = data.description;
          document.body.appendChild(this.container);
        }).catch(() => reject(new Error('Не удалось загрузить данные тикета!')));
      } else {
        document.body.appendChild(this.container);
      }
    });
  }

  close() {
    this.#resolver = null;
    this.elTitle.textContent = '';
    this.elNameInput.value = '';
    this.elDescriptionInput.value = '';
    this.container.remove();
  }
}
