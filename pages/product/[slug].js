import { useRouter } from "next/router";
import Link from "next/link";
import { useContext } from "react";
import Image from "next/image";

import Layout from "../../components/Layout";
import { data } from "../../utils/data";
import { Store } from "../../utils/Store";
import db from "../../utils/db";
import Product from "../../models/Product";
import axios from "axios";
import { toast } from "react-toastify";

const SingleProduct = ({product}) => {
    const { state, dispatch } = useContext(Store);
    const router = useRouter();
    // const { query } = useRouter();
    // const { slug } = query;

    // const product = data.products.find(x => x.slug === slug);

    if (!product) {
        return <div className="text-red-400">Product Not Found!</div>;
    }

    const addToCartHandler = async () => {
    
        const existItem = state.cart.cartItems.find(x => x.slug === product.slug);

        const quantity = existItem ? existItem.quantity + 1 : 1;

        const { data } = await axios.get(`/api/products/${product._id}`);

        if (data.countInStock < quantity) {
            toast.error("Sorry, product is out of stock")

            return;
        }
        
        dispatch({ type: "ADD_ITEM_TO_CART", payload: { ...product, quantity } });
        
        router.push('/cart')
    }

    return (
        <Layout title={product.name}>
            <div className="py-2">
                <Link href="/">back to products</Link>
            </div>

            <div className="grid md:grid-cols-4 md:gap-3">
                <div className="md:col-span-2">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={640}
                        height={640}
                        layout="responsive"
                    ></Image>
                </div>

                <div>
                    <ul>
                        <li>
                            <h1 className="text-lg font-bold">
                                {product.name}
                            </h1>
                        </li>

                        <li>Category: {product.category}</li>
                        <li>Brand: {product.brand}</li>

                        <li>
                            {product.rating} of {product.numReviews} reviews
                        </li>

                        <li>Description: {product.description}</li>
                    </ul>
                </div>

                <div>
                    <div className="card p-5">
                        <div className="mb-2 flex justify-between">
                            <div>Price</div>
                            <div>${product.price}</div>
                        </div>

                        <div className="mb-2 flex justify-between">
                            <div>Status</div>

                            <div>
                                {product.countInStock > 0 ? (
                                    <p className="text-green-500">In Stock</p>
                                ) : (
                                    <p className="text-red-500">Out Of Stock</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={addToCartHandler}
                            className="primary-button w-full"
                        >
                            add to cart
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default SingleProduct;

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;

    await db.connect()
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect()

    return {
        props: {
            product:product?db.convertDocToObj(product):null
        }
    }
}