import Sequelize from 'sequelize';
import User from '../app/models/User';
import Recipient from '../app/models/Recipients';
import databaseConfig from '../config/database';
import DeliveryMan from '../app/models/DeliveryMan';
import File from '../app/models/File';
import Delivery from '../app/models/Delivery';
import DeliveryProblem from '../app/models/DeliveryProblem';

const models = [User, Recipient, File, DeliveryMan, Delivery, DeliveryProblem];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
