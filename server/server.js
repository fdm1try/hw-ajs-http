const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const TicketList = require('./TicketList');

const app = new Koa();
app.use(cors());
app.use(koaBody());

const tickets = new TicketList();
tickets.create('Тестовый тикет', 'Описание текстового тикета');

app.use(async (ctx) => {
  const { method } = ctx.request.query;
  let ticket;
  if (ctx.request.method === 'GET') {
    switch (method) {
      case 'allTickets':
        ctx.response.body = tickets.allTickets().map((item) => item.json());
        return;

      case 'ticketById':
        ticket = tickets.findById(ctx.request.query.id);
        if (!ticket) {
          ctx.response.status = 404;
        } else {
          ctx.response.body = ticket.jsonFull();
        }
        return;
      default:
        ctx.response.status = 404;
    }
  } else if (ctx.request.method === 'POST') {
    const {
      id, name, description, status,
    } = ctx.request.body;
    switch (method) {
      case 'ticketCreate':
        ticket = tickets.create(name, description);
        ctx.response.body = ticket.json();
        return;

      case 'ticketUpdate':
        ticket = tickets.findById(id);
        if (!ticket) {
          ctx.response.status = 404;
          return;
        }
        if (name) ticket.name = name;
        if (description) ticket.description = description;
        if ([true, false].includes(status)) ticket.status = status;
        ctx.response.body = ticket.json();
        return;

      case 'ticketRemove':
        ctx.response.status = tickets.remove(id) ? 200 : 404;
        return;
      default:
        ctx.response.status = 404;
    }
  }
});

app.listen(8123);
