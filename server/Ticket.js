class Ticket {
  constructor(id, name, description, created, status) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.created = created;
    this.status = status;
  }

  json() {
    return {
      id: this.id, name: this.name, created: this.created, status: this.status,
    };
  }

  jsonFull() {
    return {
      id: this.id,
      name: this.name,
      created: this.created,
      status: this.status,
      description: this.description,
    };
  }
}

module.exports = Ticket;
