const uuid = require('uuid');
const Ticket = require('./Ticket');

class TicketList {
  #tickets = [];

  allTickets() {
    return [...this.#tickets];
  }

  findById(id) {
    return this.#tickets.find((ticket) => ticket.id === id);
  }

  create(name, description) {
    const id = uuid.v4().toString();
    const created = Date.now();
    const ticket = new Ticket(id, name, description, created, false);
    this.#tickets.push(ticket);
    return ticket;
  }

  remove(id) {
    const ticket = this.findById(id);
    if (!ticket) return false;
    this.#tickets = this.#tickets.filter((item) => item !== ticket);
    return true;
  }
}

module.exports = TicketList;
