import TicketList from './helpdesk/TicketList';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const ticketList = new TicketList(container);
  ticketList.render();
});
