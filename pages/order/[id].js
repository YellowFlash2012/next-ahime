import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import getError from "../../utils/error";
import { Store } from "../../utils/Store";

function reducer(state,action) {
    switch (action.type) {
        case "FETCH_REQ":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, error: "", order: action.payload };
        case "FETCH_FAIL":
            return {...state, loading:false, error:action.payload}
        
    
        default:
            state;
    }
}

const SingleOrder = () => {
    

    const {query} = useRouter();
    const id = query.id;

    const [{ loading, error, order }, dispatch] = useReducer(reducer, { loading: true, order: {}, error: "" });

    const fetchOrder = async () => {
        try {
            dispatch({ type: 'FETCH_REQ' });

            const { data } = await axios.get(`/api/orders/${id}`);

            dispatch({type:'FETCH_SUCCESS', payload:data})
        } catch (error) {
            dispatch({ type: "FETCH_FAIL", payload: getError(error) });
        }
    }

    useEffect(() => {
        if (!order._id || (order._id && order._id !== id)) {
            fetchOrder()
            
        }
    }, [id, order])
    
    const { shippingAddress, paymentMethod, orderItems, itemsAmount, taxAmount, shippingAmount, totalAmount, isPaid, paidAt, isDelivered, deliveredAt } = order;

    return (
        <Layout title={`Order ${id}`}>
            <h1 className="mb-4 text-xl">{`Order ${id}`}</h1>

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="alert-error">{error}</div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <div className="card p-5">
                            <h2 className="mb-2 text-lg">Shipping Address</h2>

                            <div>
                                {shippingAddress.fullName},{" "}
                                {shippingAddress.address},{" "}
                                {shippingAddress.city},{" "}
                                {shippingAddress.postalcode},{" "}
                                {shippingAddress.country}
                            </div>

                            {isDelivered ? (
                                <div className="alert-success">
                                    Delivered at {deliveredAt}
                                </div>
                            ) : (
                                <div className="alert-error">Not Delivered</div>
                            )}
                        </div>
                        <div className="card p-5">
                            <h2 className="mb-2 text-lg">Payment Method</h2>

                            <div>{paymentMethod}</div>

                            {isPaid ? (
                                <div className="alert-success">
                                    Paid at {paidAt}
                                </div>
                            ) : (
                                <div className="alert-error">Not paid!</div>
                            )}
                        </div>

                        <div className="card overflow-x-auto p-5">
                            <h2 className="mb-2 text-lg">Order Items</h2>

                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">Item</th>
                                        <th className="p-5 text-right">Qty</th>
                                        <th className="p-5 text-right">
                                            Price
                                        </th>
                                        <th className="p-5 text-right">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {orderItems.map((item) => (
                                        <tr key={item._id} className="border-b">
                                            <td>
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                >
                                                    <a className="flx items-center">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={50}
                                                            height={50}
                                                        />
                                                        &nbsp;
                                                        {item.name}
                                                    </a>
                                                </Link>
                                            </td>

                                            <td className="p-5 text-right">
                                                {item.quantity}
                                            </td>

                                            <td className="p-5 text-right">
                                                ${item.price}
                                            </td>

                                            <td className="p-5 text-right">
                                                ${item.price * item.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
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
                                        <div>Total</div>
                                        <div>${totalAmount}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};
export default SingleOrder;

SingleOrder.auth=true
