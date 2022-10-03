import bcryptjs from "bcryptjs";
import { getSession } from "next-auth/react"
import User from "../../../models/User";
import db from "../../../utils/db";

const handler = async (req, res) => {
    if (req.mehtod !== 'PUT') {
        return res.status(400).send(`${req.method} nit supported`)
    }

    const session = await getSession({ req });

    if (!session) {
        return res.status(401).send("Login required!")
    }

    const { user } = session;

    const { name, email, password } = req.body;

    if (!name || !email || !email.includes('@') || (password && password.trim().length < 13)) {
        res.status(422).send("Validation error!");

        return;
    };

    await db.connect();

    const userToBeUpdated = await User.findById(user._id);

    userToBeUpdated.name = name;
    userToBeUpdated.email = email;

    if (password) {
        userToBeUpdated.password=bcryptjs.hashSync(password)
    }

    await userToBeUpdated.save()
    await db.disconnect()

    res.send("Update was successfull!")
};

export default handler