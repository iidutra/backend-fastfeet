import Mail from '../../lib/Mail';

class NewDelivery {
    get key() {
        return 'NewDelivery';
    }

    async handle({ data }) {
        const { delivery } = data;

        await Mail.sendMail({
            to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
            subject: 'Nova Entrega',
            template: 'newDelivery',
            context: {
                deliveryman: delivery.deliveryman.name,
                product: delivery.product,
                name: delivery.recipient.name,
                cep: delivery.recipient.cep,
                number: delivery.recipient.number,
                complement: delivery.recipient.complement
                    ? delivery.recipient.complement
                    : 'Sem complemento',
            },
        });
    }
}

export default new NewDelivery();
