import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const deliverysMan = await DeliveryMan.findAll({
            limit: 20,
            offset: (page - 1) * 20,
            attributes: ['id', 'name', 'email'],
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url'],
                },
            ],
        });

        return res.json(deliverysMan);
    }

    async show(req, res) {
        const { deliveryManId } = req.params;

        const deliveryMan = await DeliveryMan.findByPk(deliveryManId, {
            attributes: ['id', 'name', 'email'],
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url'],
                },
            ],
        });

        if (!deliveryMan) {
            return res.status(400).json({ error: 'DeliveryMan not found' });
        }
        return res.json(deliveryMan);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            avatar_id: Yup.number().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res
                .status(400)
                .json({ error: 'Name, email and Avatar ID are required' });
        }

        const emailExists = await DeliveryMan.findOne({
            where: { email: req.body.email },
        });

        if (emailExists) {
            return res.status(401).json({ error: 'E-mail already exists' });
        }

        const { id, name, email, avatar_id } = await DeliveryMan.create(
            req.body
        );

        return res.json({
            id,
            name,
            email,
            avatar_id,
        });
    }

    async update(req, res) {
        const deliverManId = req.params;

        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            avatar_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }
        if (!req.body) {
            return res
                .status(400)
                .json({ error: 'At least 1 attribute should be updated' });
        }

        const emailExists = await DeliveryMan.findOne({
            where: { email: req.body.email },
        });

        if (emailExists) {
            return res.status(401).json({ error: 'E-mail already exists' });
        }
        const deliveryMan = await DeliveryMan.findByPk(deliverManId);

        if (!deliveryMan) {
            return res.status(400).json({ error: 'Deliveryman not found' });
        }
        const { name, email, avatar_id } = await deliveryMan.update(req.body);

        return res.json({
            name,
            email,
            avatar_id,
        });
    }

    async delete(req, res) {
        const { deliveryManId } = req.params;

        const deliveryMan = await DeliveryMan.findByPk(deliveryManId);

        if (!deliveryMan) {
            res.status(400).json({ error: 'Deliveryman not found' });
        }

        await deliveryMan.destroy();

        return res.json({ msg: 'Deleted with sucess' });
    }
}

export default new DeliveryManController();
