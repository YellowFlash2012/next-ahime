import { getSession } from "next-auth/react";

const cloudinary = require("cloudinary").v2;

export default async function signature(req, res) {
    const session = await getSession({ req });

    if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).send("Admin Only Privilege!");
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
        },
        process.env.CLOUDINARY_API_SECRET
    );

    res.statusCode = 200
    res.json({ signature, timestamp });
}