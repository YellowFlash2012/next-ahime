import { useRouter } from "next/router";
import { TiWarningOutline } from "react-icons/ti";

import Layout from "../components/Layout";

const Unauthorized = () => {
    const router = useRouter();
    const { message } = router.query;

    return (
        <Layout title="unauthorized page">
            <TiWarningOutline className="mx-auto  text-red-900 text-9xl font-bold mb-8" />
            <h1 className="text-center text-xl">Access Denied</h1>

            {message && (
                <div className=" text-center mx-auto text-red-500">{message}</div>
            )}
        </Layout>
    );
};
export default Unauthorized;
