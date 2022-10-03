import { getSession } from "next-auth/react";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).send("Login required!");
    }

    await db.connect()

    const order = await Order.findById(req.query.id);

    if (order) {
        if (order.isPaid) {
            return res.status(400).send("Error is already paid!")
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            email_address:req.body.email
        }

        const paidOrder = await order.save();
        await db.disconnect();

        res.send({ message: 'Order Payment is successful!', order: paidOrder });
    } else {
        await db.disconnect();
        res.status(404).send("Order with that id was NOT found")
    }
}

export default handler