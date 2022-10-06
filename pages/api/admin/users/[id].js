import { getSession } from "next-auth/react";
import User from "../../../../models/User";
import db from "../../../../utils/db";

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).send("Admin Only Privilege!");
    }

    await db.connect();

    const user = await User.findById(req.query.id);

    if (user.isAdmin) {
        return res.status(400).send("Admin user can NOT be deleted!")
    }

    await User.findByIdAndDelete(req.query.id);

    await db.disconnect();

    res.send("Done, user is deleted!");
};

export default handler;
