import asyncRequest from './utils';

export default class API {
  static get endpoint() {
    return 'http://localhost:8123/';
  }

  static getAllTickets() {
    return new Promise((resolve, reject) => {
      asyncRequest('GET', API.endpoint, { method: 'allTickets' })
        .then(resolve).catch(reject);
    });
  }

  static getTicketById(id) {
    return new Promise((resolve, reject) => {
      asyncRequest('GET', API.endpoint, { method: 'ticketById', id })
        .then(resolve).catch(reject);
    });
  }

  static createTicket(name, description) {
    return new Promise((resolve, reject) => {
      asyncRequest('POST', `${API.endpoint}?method=ticketCreate`, {
        name, description,
      }).then(resolve).catch((error) => reject(new Error(`Can not create ticket, error: ${error}`)));
    });
  }

  static updateTicket(id, data) {
    const { name, description, status } = data;
    return new Promise((resolve, reject) => {
      asyncRequest('POST', `${API.endpoint}?method=ticketUpdate`, {
        method: 'ticketUpdate', id, name, description, status,
      }).then(resolve).catch(reject);
    });
  }

  static removeTicket(id) {
    return new Promise((resolve, reject) => {
      asyncRequest('POST', `${API.endpoint}?method=ticketRemove`, { id })
        .then(resolve).catch(reject);
    });
  }
}
