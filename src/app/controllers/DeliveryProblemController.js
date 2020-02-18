import * as Yup from 'yup';
import { startOfHour, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipients';
import DeliveryMan from '../models/DeliveryMan';
import DeliveryProblem from '../models/DeliveryProblem';
import CancelDelivery from '../jobs/CancelDelivery';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
    async index(req, res) {
        const deliveriesWithProblema = await DeliveryProblem.findAll({
            attributes: ['id', 'description'],
            include: [
                {
                    model: Delivery,
                    as: 'delivery',
                    attributes: ['id', 'product', 'start_date', 'canceled_at'],
                },
            ],
        });
        return res.json(deliveriesWithProblema);
    }

    async show(req, res) {
        const { deliveryId } = req.params;

        const deliveryWithProblems = await DeliveryProblem.findOne({
            where: { delivery_id: deliveryId },
            attributes: ['id', 'description'],
            include: [
                {
                    model: Delivery,
                    as: 'delivery',
                    attributes: ['id', 'start_date', 'canceled_at'],
                },
            ],
        });
        if (!deliveryWithProblems) {
            return res
                .status(400)
                .json({ error: 'This delivery does not have problems' });
        }
        return res.json(deliveryWithProblems);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
        });
        if (!(await schema.isValid())) {
            return res.status(400).json({ error: 'Description is required' });
        }

        const { deliveryId } = req.params;
        const delivery = await Delivery.findByPk(deliveryId);

        if (!delivery) {
            return res.status(400).json({ error: 'Delivery not found' });
        }

        const { description } = req.body;

        const deliveryProblem = await DeliveryProblem.create({
            description,
            delivery_id: deliveryId,
        });
        return res.json(deliveryProblem);
    }

    async delete(req, res) {
        const { problemId } = req.params;

        const problem = await DeliveryProblem.findByPk(problemId, {
            attributes: ['id', 'description', 'delivery_id'],
        });

        if (!problem) {
            return res.status(400).json({ error: 'Problema not found' });
        }

        const { delivery_id } = problem;

        const delivery = await Delivery.findByPk(delivery_id, {
            attributes: ['id', 'product', 'canceled_at'],
            include: [
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: [
                        'id',
                        'name',
                        'zipcode',
                        'number',
                        'complement',
                    ],
                },
                {
                    model: DeliveryMan,
                    as: 'deliveryman',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });
        if (delivery.canceled_at) {
            return res
                .status(401)
                .json({ error: 'This delivery is already canceled' });
        }

        const now = new Date();
        const hourStart = startOfHour(now);
        const formattedDate = format(hourStart, "yyyy-MM-dd'T'HH:mm:ssxxx", {
            locale: pt,
        });

        const updateDelivery = await delivery.update({
            canceled_at: formattedDate,
        });

        await Queue.addKey(CancelDelivery.key, {
            updateDelivery,
            problem,
        });

        return res.json(updateDelivery);
    }
}

export default new DeliveryProblemController();
