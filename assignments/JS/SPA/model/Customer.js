export var customer = {
    id : '',
    name: '',
    address : '',
    salary : '',

    addValue(id, name, address, salary) {
        this.id += id;
        this.name += name;
        this.address += address;
        this.salary += salary;
    },
}

// window.customer = customer;