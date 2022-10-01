import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

const Shipping = () => {
    const { handleSubmit, register, formState: { errors }, setValue} = useForm();

    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { shippingAddress } = cart;

    const router=useRouter()

    useEffect(() => {
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('postalcode', shippingAddress.postalcode);
        setValue('country', shippingAddress.country);
    },[setValue, shippingAddress])

    const shippingSubmitHandler = ({ fullName, address, city, postalcode, country }) => {
        dispatch({
            type: "SAVE_SHIPPING_ADDRESS",
            payload: { fullName, address, city, postalcode, country,location },
        });

        Cookies.set('cart', JSON.stringify({
            ...cart,
            shippingAddress: {
                fullName,address,city,postalcode,country,location
            }
        }))

        router.push('/payment')
    }

    return (
        <Layout title="shipping address">
            <CheckoutWizard activeStep={1} />

            <form
                className="mx-auto max-w-screen-md"
                onSubmit={handleSubmit(shippingSubmitHandler)}
            >
                <h1 className="mb-4 text-xl">Shipping Address</h1>

                <div className="mb-4">
                    <label htmlFor="fullName">Full Name</label>

                    <input
                        type="text"
                        className="w-full"
                        id="fullName"
                        placeholder="Enter your full name"
                        autoFocus
                        {...register("fullName", {
                            required: "Your full name is required",
                        })}
                    />

                    {errors.fullName && (
                        <div className="text-red-500">
                            {errors.fullName.message}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="address">Address</label>

                    <input
                        type="text"
                        className="w-full"
                        id="address"
                        placeholder="Enter your correct address"
                        {...register("address", {
                            required: "Your address is required",
                            minLength: {
                                value: 10,
                                message:
                                    "Your address should at least 10 characters long",
                            },
                        })}
                    />

                    {errors.address && (
                        <div className="text-red-500">
                            {errors.address.message}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="city">City</label>

                    <input
                        type="text"
                        className="w-full"
                        id="city"
                        placeholder="Enter your city"
                        {...register("city", {
                            required: "Your city is required",
                        })}
                    />

                    {errors.city && (
                        <div className="text-red-500">
                            {errors.city.message}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="postalcode">Postal Code</label>

                    <input
                        type="text"
                        className="w-full"
                        id="postalcode"
                        placeholder="Enter your postal code"
                        {...register("postalcode", {
                            required: "Your postal code is required",
                        })}
                    />

                    {errors.postalcode && (
                        <div className="text-red-500">
                            {errors.postalcode.message}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="country">Country</label>

                    <input
                        type="text"
                        className="w-full"
                        id="country"
                        placeholder="Enter your country"
                        {...register("country", {
                            required: "Your country is required",
                        })}
                    />

                    {errors.country && (
                        <div className="text-red-500">
                            {errors.country.message}
                        </div>
                    )}
                </div>

                <div className="mb-4 flex justify-between">
                    <button className="primary-button">
                        Next
                    </button>
                </div>
            </form>
        </Layout>
    );
};

export default Shipping
Shipping.auth=true;
