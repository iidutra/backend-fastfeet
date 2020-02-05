import Sequelize from 'sequelize';

import User from '../app/models/Users';
import Recipient from '../app/models/Recipients';

import databaseConfig from '../config/database';

const models = [User, Recipient];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models.map(model => model.init(this.connection));
    }
}

export default new Database();
