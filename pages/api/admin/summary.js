import { getSession } from "next-auth/react"
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import User from "../../../models/User";
import db from "../../../utils/db";

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).send("Admin Only Privilege!")
    }

    await db.connect()

    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();

    const ordersAmountGroup = await Order.aggregate([
        {
            $group: {
                _id: null,
                sales:{$sum:'$totalAmount'}
            }
        }
    ])

    const ordersAmount = ordersAmountGroup.length > 0 ? ordersAmountGroup[0].sales : 0;

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                totalSales:{$sum:'$totalAmount'}
            }
        }
    ])

    await db.disconnect()

    res.send({
        ordersCount,
        productsCount,
        usersCount,
        ordersAmount,
        salesData,
    });
};

export default handler