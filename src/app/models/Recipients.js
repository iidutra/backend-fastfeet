import Sequelize, { Model } from 'sequelize';

class Recipients extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                street: Sequelize.STRING,
                number: Sequelize.NUMBER,
                complement: Sequelize.STRING,
                state: Sequelize.STRING,
                city: Sequelize.STRING,
                zipcode: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
    }
}

export default Recipients;
