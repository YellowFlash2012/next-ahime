import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie"


import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import getError from "../utils/error";
import { Store } from "../utils/Store";

const Placeorder = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { state, dispatch } = useContext(Store);
    const { cart } = state;

    const { cartItems, shippingAddress, paymentMethod } = cart;

    const round2 = num => Math.round(num * 100 + Number.EPSILON) / 100;

    const itemsAmount = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));

    const taxAmount = round2(itemsAmount*0.15)
    
    const shippingAmount = itemsAmount > 200 ? 0 : 15;

    const totalAmount = round2(itemsAmount + shippingAmount + taxAmount);

    useEffect(() => {
        if (!paymentMethod) {
            return router.push("/payment")
        }
    },[router, paymentMethod])

    const placeOrderHandler = async () => {
        try {
            setLoading(true)

            const { data } = await axios.post('/api/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsAmount,
                shippingAmount,
                taxAmount,
                totalAmount
            })

            setLoading(false)

            dispatch({ type: 'CLEAR_ITEMS_FROM_CART' })
            
            Cookies.set('cart', JSON.stringify({
                ...cart,
                cartItems:[]
            }))

            router.push(`/order/${data._id}`)
            
        } catch (error) {
            setLoading(false)
            toast.error(getError(error))
        }
    }

    return <Layout title="Place Order">
        <CheckoutWizard activeStep={3} />

        <h1 className="mb-4 text-xl">Place Order</h1>

        {cartItems.length === 0 ? <div>
                    Cart is empty! <Link href="/">
                        <a className="font-bold text-blue-500">
                        Go pick a product

                        </a>
                    </Link>
        </div> : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <div className="card p-5">
                            <h2 className="mb-2 text-lg">Shipping Address</h2>

                            <div>
                                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                                {shippingAddress.city}, {shippingAddress.postalcode},{" "}
                                {shippingAddress.country}
                            </div>

                            <div>
                                <Link href="/shipping">
                                    Edit
                                </Link>
                            </div>
                        </div>

                        <div className="card p-5">
                            <h2 className="mb-2 text-lg">Payment Mehtod</h2>

                            <div>{paymentMethod}</div>

                            <div>
                                <Link href="/payment">Edit</Link>
                            </div>
                        </div>

                        <div className="card overflow-x-auto p-5">
                            <h2 className="mb-2 text-lg">Order Items</h2>

                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">Item</th>
                                        <th className="p-5 text-right">Qty</th>
                                        <th className="p-5 text-right">Price</th>
                                        <th className="p-5 text-right">Subtotal</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cartItems.map(item => (
                                        <tr key={item._id} className="border-b">
                                            <td>
                                                <Link href={`/product/${item.slug}`}>
                                                    <a className="flex items-center">
                                                        <Image src={item.image} alt={item.name} width={50}
                                                            height={50} />
                                                        &nbsp;
                                                        {item.name}
                                                    </a>
                                                </Link>
                                            </td>
                                            
                                            <td className="p-5 text-right">{item.quantity}</td>
                                            
                                            <td className="p-5 text-right">${ item.price}</td>
                                            
                                            <td className="p-5 text-right">${item.price*item.quantity}</td>

                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div>
                                <Link href="/cart">Edit</Link>
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <h2 className="mb-2 text-lg">Order Summary</h2>

                        <ul>
                            <li>
                                <div className="mb-2 flex justify-between">
                                    <div>Items</div>

                                    <div>${itemsAmount}</div>
                                </div>
                            </li>
                            
                            <li>
                                <div className="mb-2 flex justify-between">
                                    <div>Tax</div>

                                    <div>${taxAmount}</div>
                                </div>
                            </li>
                            
                            <li>
                                <div className="mb-2 flex justify-between">
                                    <div>Shipping</div>

                                    <div>${shippingAmount}</div>
                                </div>
                            </li>
                            
                            <li>
                                <div className="mb-2 flex justify-between">
                                    <div>Total Amount</div>

                                    <div>${totalAmount}</div>
                                </div>
                            </li>

                            <li>
                                <button
                                    disabled={loading}
                                    onClick={placeOrderHandler}
                                    className="primary-button w-full"
                                >
                                    {loading?'Loading...':'Place Order'}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                )}
    </Layout>
};
export default Placeorder;
Placeorder.auth = true;