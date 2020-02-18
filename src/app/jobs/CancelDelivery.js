import Mail from '../../lib/Mail';

class CancelDelivery {
    get key() {
        return 'CancelDelivery';
    }

    async handle({ data }) {
        const { updateDelivery, problem } = data;

        await Mail.sendMail({
            to: `${updateDelivery.deliveryMan.name} <${updateDelivery.deliveryMan.email}`,
            subject: 'Entrega Cancelada',
            template: 'cancelDelivery',
            context: {
                deliveryMan: updateDelivery.deliveryMan.name,
                product: updateDelivery.product,
                name: updateDelivery.recipient.name,
                zipcode: updateDelivery.zipcode,
                number: updateDelivery.recipient.number,
                complement: updateDelivery.recipient.complement
                    ? updateDelivery.recipient.complement
                    : 'Sem complemento',
                problem: problem.description,
            },
        });
    }
}

export default new CancelDelivery();
