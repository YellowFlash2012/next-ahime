import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckoutWizard from "../components/CheckoutWizard";
import Cookies from "js-cookie";

import Layout from "../components/Layout";
import { Store } from "../utils/Store";

const Payment = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    const { state, dispatch } = useContext(Store);

    const { cart } = state;
    const { shippingAddress, paymentMethod } = cart;

    const router = useRouter();

    const paymentHandler = (e) => {
        e.preventDefault();

        if (!selectedPaymentMethod) {
            return toast.error("You need to select a payment method");
        }

        dispatch({
            type: "SAVE_PAYMENT_METHOD",
            payload: selectedPaymentMethod,
        });

        Cookies.set(
            "cart",
            JSON.stringify({ ...cart, paymentMethod: selectedPaymentMethod })
        );

        router.push("/placeorder");
    };

    useEffect(() => {
        if (!shippingAddress.address) {
            return router.push("/shipping");
        }

        setSelectedPaymentMethod(paymentMethod || "");
    }, [paymentMethod, router, shippingAddress]);

    return (
        <Layout title="PaymentMethod">
            <CheckoutWizard activeStep={2} />

            <form className="mx-auto max-w-screen-md" onSubmit={paymentHandler}>
                <h1 className="mb-4 text-xl">Payment Method</h1>

                {["Bitcoin", "Stripe", "CashOnDelivery"].map((payment) => (
                    <div key={payment} className="mb-4">
                        <input
                            className="p-2 outline-none focus:ring-0"
                            type="radio"
                            id={payment}
                            name='paymentMethod'
                            checked={selectedPaymentMethod === payment}
                            onChange={() => setSelectedPaymentMethod(payment)}
                        />

                        <label htmlFor="payment" className="p-2">
                            {payment}
                        </label>
                    </div>
                ))}

                <div className="mb-4 flex justify-between">
                    <button
                        type="button"
                        className="default-button"
                        onClick={() => router.push("/shipping")}
                    >
                        Back
                    </button>

                    <button className="primary-button">Next</button>
                </div>
            </form>
        </Layout>
    );
};
export default Payment;
Payment.auth = true;