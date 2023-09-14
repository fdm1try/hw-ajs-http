import moment from 'moment';
import API from '../api';
import Modal from './Modal';

export default class Ticket {
  #editListeners = [];

  #removeListeners = [];

  #statusListeners = [];

  #id;

  #name;

  #created;

  #status;

  static get markup() {
    return `
      <div class="ticket-list-item-status">
        <input type="checkbox" class="ticket-list-item-status_checkbox" checked=false>
      </div>
      <div class="ticket-list-item-name">
      </div>
      <div class="ticket-list-item-created">
      </div>
      <div class="ticket-list-item-controls">
        <button class="ticket-list-item-controls-edit_button">✎</button>
        <button class="ticket-list-item-controls-remove_button">✖</button>
      </div>
    `;
  }

  static get classNameDescription() {
    return 'ticket-list-item-description';
  }

  static get selector() {
    return '.ticket-list-item';
  }

  static get selectorStatus() {
    return '.ticket-list-item-status';
  }

  static get selectorStatusCheckbox() {
    return '.ticket-list-item-status_checkbox';
  }

  static get selectorName() {
    return '.ticket-list-item-name';
  }

  static get selectorCreated() {
    return '.ticket-list-item-created';
  }

  static get selectorEditButton() {
    return '.ticket-list-item-controls-edit_button';
  }

  static get selectorRemoveButton() {
    return '.ticket-list-item-controls-remove_button';
  }

  constructor(id, name, created, status) {
    this.#id = id;

    this.container = document.createElement('div');
    this.container.classList.add('ticket-list-item');
    this.container.innerHTML = Ticket.markup;

    this.onEditButtonClick = this.onEditButtonClick.bind(this);
    this.onRemoveButtonClick = this.onRemoveButtonClick.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.onTicketBodyClick = this.onTicketBodyClick.bind(this);

    this.elStatus = this.container.querySelector(Ticket.selectorStatus);
    this.elStatusCheckbox = this.container.querySelector(Ticket.selectorStatusCheckbox);
    this.elName = this.container.querySelector(Ticket.selectorName);
    this.elCreated = this.container.querySelector(Ticket.selectorCreated);
    this.elEditButton = this.container.querySelector(Ticket.selectorEditButton);
    this.elRemoveButton = this.container.querySelector(Ticket.selectorRemoveButton);

    this.name = name;
    this.status = status;
    this.created = created;

    this.registerEvents();
  }

  registerEvents() {
    this.elStatusCheckbox.addEventListener('change', this.onStatusChange);
    this.elEditButton.addEventListener('click', this.onEditButtonClick);
    this.elRemoveButton.addEventListener('click', this.onRemoveButtonClick);
    this.container.addEventListener('click', this.onTicketBodyClick);
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    this.#name = value;
    this.elName.textContent = value;
  }

  get status() {
    return this.#status;
  }

  set status(value) {
    this.#status = !!value;
    this.elStatusCheckbox.checked = this.#status;
  }

  get created() {
    return this.#created;
  }

  set created(value) {
    this.#created = value;
    this.elCreated.textContent = moment(new Date(this.#created)).format('DD.MM.YYYY hh:mm');
  }

  addEditButtonClickListener(callback) {
    this.#editListeners.push(callback);
  }

  addRemoveButtonClickListener(callback) {
    this.#removeListeners.push(callback);
  }

  addStatusChangeListener(callback) {
    this.#statusListeners.push(callback);
  }

  onTicketBodyClick(event) {
    const { target } = event;
    if (target.closest(Ticket.selectorStatus) || target.closest(Ticket.selectorEditButton)
      || target.closest(Ticket.selectorRemoveButton)) return;
    if (this.elDescription) {
      this.elDescription.remove();
      this.elDescription = null;
      return;
    }
    this.getFullInfo().then((data) => {
      this.elDescription = document.createElement('div');
      this.elDescription.classList.add(Ticket.classNameDescription);
      this.elDescription.textContent = data.description;
      this.elName.appendChild(this.elDescription);
    }).catch(() => Modal.showError('Не удалось загрузить данные тикета!'));
  }

  onEditButtonClick() {
    for (const callback of this.#editListeners) callback(this);
  }

  onRemoveButtonClick() {
    for (const callback of this.#removeListeners) callback(this);
  }

  onStatusChange() {
    this.elStatusCheckbox.checked = !this.elStatusCheckbox.checked;
    for (const callback of this.#statusListeners) callback(this, !this.status);
  }

  getFullInfo() {
    return API.getTicketById(this.id);
  }

  remove() {
    this.#editListeners = [];
    this.#removeListeners = [];
    this.#statusListeners = [];
    this.container.remove();
  }
}
