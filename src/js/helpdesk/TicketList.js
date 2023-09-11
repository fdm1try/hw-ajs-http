import TicketEditor from './TicketEditor';
import Ticket from './Ticket';
import API from '../api';
import Modal from './Modal';

export default class TicketList {
  #tickets = [];

  static get markup() {
    return `
      <div class="ticket-list">
        <button class="ticket-list-add_button">Добавить тикет</button>
        <div class="ticket-list-items">
        </div>
      </div>
    `;
  }

  static get selector() {
    return '.ticket-list';
  }

  static get selectorAddButton() {
    return '.ticket-list-add_button';
  }

  static get selectorItems() {
    return '.ticket-list-items';
  }

  constructor(container = null) {
    this.container = container || document.body;
    this.editor = new TicketEditor();

    this.onAddButtonClick = this.onAddButtonClick.bind(this);
    this.onAddTicket = this.onAddTicket.bind(this);
    this.onEditTicket = this.onEditTicket.bind(this);
    this.onRemoveTicket = this.onRemoveTicket.bind(this);
    this.onTicketStatusChange = this.onTicketStatusChange.bind(this);

    this.elItems = this.container.querySelector(TicketList.selectorItems);
  }

  get tickets() {
    return [...this.#tickets];
  }

  addTicket(ticket) {
    this.#tickets.push(ticket);
    ticket.addEditButtonClickListener(this.onEditTicket);
    ticket.addRemoveButtonClickListener(this.onRemoveTicket);
    ticket.addStatusChangeListener(this.onTicketStatusChange);
    this.elItems.appendChild(ticket.container);
  }

  removeTicket(ticket) {
    this.#tickets = this.#tickets.filter((item) => item !== ticket);
    ticket.remove();
  }

  render() {
    this.container.innerHTML = TicketList.markup;
    this.elAddButton = this.container.querySelector(TicketList.selectorAddButton);
    this.elItems = this.container.querySelector(TicketList.selectorItems);

    this.registerEvents();
    API.getAllTickets().then((data) => {
      for (const ticketData of data) {
        const {
          id, name, created, status,
        } = ticketData;
        const ticket = new Ticket(id, name, created, status);
        this.addTicket(ticket);
      }
    });
  }

  registerEvents() {
    this.elAddButton.addEventListener('click', this.onAddButtonClick);
  }

  onAddButtonClick() {
    this.editor.open('Добавить тикет').then(this.onAddTicket);
  }

  onAddTicket(data) {
    API.createTicket(data.name, data.description).then((response) => {
      const {
        id, name, created, status,
      } = response;
      this.addTicket(new Ticket(id, name, created, status));
    }).catch(() => Modal.showError('Ошибка', 'Не удалось создать тикет!'));
  }

  onEditTicket(ticket) {
    this.editor.open('Изменить тикет', ticket.id).then((data) => {
      const { name, description } = data;
      API.updateTicket(ticket.id, { name, description }).then(() => {
        const ticketToUpdate = ticket;
        ticketToUpdate.name = name;
        ticketToUpdate.description = description;
      }).catch(() => Modal.showError('Ошибка', 'Не удалось изменить данные тикета!'));
    }).catch(Modal.showError);
  }

  onRemoveTicket(ticket) {
    Modal.confirmDialog('Удалить тикет', 'Вы уверены что хотите удалить тикет? Это действие необратимо.').then(() => {
      API.removeTicket(ticket.id).then(() => {
        this.removeTicket(ticket);
      }).catch(() => Modal.showError('Ошибка', 'Не удалось удалить тикет!'));
    }).catch(Modal.showError);
  }

  // eslint-disable-next-line class-methods-use-this
  onTicketStatusChange(ticket, status) {
    API.updateTicket(ticket.id, { status }).then((ticketData) => {
      const ticketToUpdate = ticket;
      ticketToUpdate.status = ticketData.status;
    }).catch(() => Modal.showError('Ошибка', 'Не удалось изменить статус тикета!'));
  }
}
