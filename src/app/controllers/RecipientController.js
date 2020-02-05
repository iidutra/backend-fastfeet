import * as Yup from 'yup';
import Recipient from '../models/Recipients';
import User from '../models/Users';

class RecipientController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.number().required(),
            complement: Yup.number().notRequired(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            zipcode: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        // verificando se o usuário é admin

        const { provider_id } = req.body;

        const checkIsProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });
        if (!checkIsProvider) {
            return res.status(400).json({
                error: 'You can only create recipient with providers',
            });
        }

        const recipientExists = await Recipient.findOne({
            where: { name: req.body.name },
        });

        if (recipientExists) {
            return res.status(400).json({ error: 'Recipient already exists' });
        }

        const {
            id,
            name,
            street,
            number,
            state,
            city,
            zipcode,
        } = await Recipient.create(req.body);

        return res.json({
            id,
            name,
            street,
            number,
            state,
            city,
            zipcode,
        });
    }

    async update(req, res) {
        const schema = Yup.object().schema({
            name: Yup.string(),
            street: Yup.string(),
            number: Yup.number(),
            state: Yup.string(),
            city: Yup.string(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const { name } = req.body;

        const recipient = await Recipient.findByPk(req.recipientId);

        if (name && name !== recipient.name) {
            const recipientExists = await Recipient.findOne({
                where: { name },
            });
            if (recipientExists) {
                return res
                    .status(400)
                    .json({ error: 'Recipient already exists.' });
            }
        }
        const { id, street, number } = await recipient.update(req.body);

        return res.json({
            id,
            street,
            number,
        });
    }
}

export default new RecipientController();
