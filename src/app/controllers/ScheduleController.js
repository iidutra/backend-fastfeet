import { startOfHour, format, startOfDay, endOfDay } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipients';
import DeliveryMan from '../models/DeliveryMan';

class ScheduleController {
    async index(req, res) {
        const { deliveryManId } = req.params;

        const deliverymanExists = await DeliveryMan.findByPk(deliveryManId);

        if (!deliverymanExists) {
            return res.status(400).json({ error: 'Deliveryman not found' });
        }

        const deliveries = await Delivery.findAll({
            where: {
                deliveryman_id: deliveryManId,
                end_date: null,
                canceled_at: null,
            },
            attributes: ['id', 'product', 'start_date', 'end_date'],
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
            ],
        });
        if (!deliveries.length === 0) {
            return res.status({
                message: 'No deliveries for this deliveryman',
            });
        }

        return res.json(deliveries);
    }

    async update(req, res) {
        const { deliveryId, deliveryManId } = req.params;

        const deliveryman = await DeliveryMan.findByPk(deliveryManId);

        if (!deliveryman) {
            return res.status(400).json({ error: 'Deliveryman not found' });
        }

        const delivery = await Delivery.findByPk(deliveryId);

        if (!delivery) {
            return res.status(400).json({ error: 'Delivery not found' });
        }
        if (delivery.deliveryman_id !== Number(deliveryManId)) {
            return res
                .status(401)
                .json({ error: 'You can only edit deliveries thet you own' });
        }
        if (delivery.start_date) {
            return res
                .status(401)
                .json({ error: 'This delivery wal already withdrawn' });
        }
        const now = new Date();
        const hourStart = startOfHour(now);
        const formattedDate = format(hourStart, "yyyy-MM-dd'T'HH:mm:ssxxx", {
            locale: pt,
        });

        const deliveriesWithDrawn = await Delivery.findAndCountAll({
            where: {
                start_date: {
                    [Op.between]: [
                        startOfDay(now.getTime()),
                        endOfDay(now.getTime()),
                    ],
                    deliveryman_id: deliveryManId,
                },
            },
        });

        if (deliveriesWithDrawn.count > 4) {
            return res
                .status(401)
                .json({ error: 'You can only withdrawn 5 deliveries per day' });
        }
        const { id, product, end_date, start_date } = await delivery.update({
            start_date: formattedDate,
        });

        return res.json({
            id,
            product,
            end_date,
            start_date,
        });
    }
}

export default new ScheduleController();
