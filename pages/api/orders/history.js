import { getSession } from "next-auth/react"
import Order from "../../../models/Order";
import db from "../../../utils/db";

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).send("Login required!")
    }

    const { user } = session;
    // console.log(user);

    await db.connect();

    const orders = await Order.find({ user: user._id });
    // console.log(orders);

    await db.disconnect()

    res.send(orders)
}

export default handler