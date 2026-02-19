const { all } = require("axios");

class UsersStorage {
    constructor() {
        this.storage = {};
        this.id = 0;
    }

    addUser({ firstName, lastName, email, age, bio }) {
        const id = this.id;
        this.storage[id] = { id, firstName, lastName, email, age, bio };
        this.id++;
    }

    getUsers() {
        return Object.values(this.storage);
    }

    getUser(id) {
        return this.storage[id];
    }

    getSearch(firstName) {
        // Convert storage object in an array of user objects
        const allUsers = Object.values(this.storage);

        // Filter the array for users whose name matches the search
        return allUsers.filter(user => 
            user.firstName.toLowerCase().includes(firstName.toLowerCase())
        );
    }

    updateUser(id, { firstName, lastName, email, age, bio }) {
        this.storage[id] = { id, firstName, lastName, email, age, bio };
    }

    deleteUser(id) {
        delete this.storage[id];
    }
}

module.exports = new UsersStorage();