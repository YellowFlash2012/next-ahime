import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import getError from "../../utils/error";

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_REQ":
            return { ...state, loading: true, error: "" };

        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                products: action.payload,
                error: "",
            };

        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };

        case "ADD_NEW_PRODUCT_REQ":
            return { ...state, loadingAddNew: true, errorAddNew: "" };

        case "ADD_NEW_PRODUCT_SUCCESS":
            return {
                ...state,
                loadingAddNew: false,

                errorAddNew: "",
            };

        case "ADD_NEW_PRODUCT_FAIL":
            return {
                ...state,
                loadingAddNew: false,
                errorAddNew: action.payload,
            };
        
        case "DELETE_REQ":
            return { ...state, loadingDelete: true };

        case "DELETE_SUCCESS":
            return {
                ...state,
                loadingDelete: false,

                successDelete: true,
            };

        case "DELETE_FAIL":
            return {
                ...state,
                loadingDelete: false,
            
            };
        
        case "DELETE_RESET":
            return {...state, loadingDelete:false, successDelete:false}

        default:
            state;
    }
}

const Products = () => {
    const router = useRouter();

    const [
        { loading, error, products, loadingAddNew, loadingDelete, successDelete },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        products: [],
        error: "",
    });

    const fetchData = async () => {
        try {
            dispatch({ type: "FETCH_REQ" });

            const { data } = await axios.get("/api/admin/products");

            dispatch({ type: "FETCH_SUCCESS", payload: data });
        } catch (error) {
            dispatch({ type: "FETCH_FAIL", payload: getError(error) });
        }
    };

    useEffect(() => {
        if (successDelete) {
            dispatch({ type: "DELETE_RESET" });
        } else {
            fetchData();
        }
    }, [successDelete]);

    const deleteProductHandler = async (id) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }

        try {
            dispatch({ type: "DELETE_REQ" });

            await axios.delete(`/api/admin/products/${id}`);

            dispatch({ type: "DELETE_SUCCESS" });

            toast.success('Done, product deleted!')
        } catch (error) {
            dispatch({ type: "DELETE_FAIL" });

            toast.error(getError(error))
        }
    }

    const addNewProductHandler = async () => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        try {
            dispatch({ type: "ADD_NEW_PRODUCT_REQ" });
            
            const { data } = await axios.post("/api/admin/products");
            
            dispatch({ type: "ADD_NEW_PRODUCT_SUCCESS" });

            toast.success("Success! New product created")

            router.push(`/admin/product/${data._id}`)

        } catch (error) {
            dispatch({ type: "ADD_NEW_PRODUCT_FAIL", payload: getError(error) })
            
            toast.error(getError(error))
        }
    }

    return (
        <Layout title="Admin Products List">
            <div className="grid md:grid-cols-4 md:gap-5">
                <div>
                    <ul>
                        <li>
                            <Link href="/admin/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/admin/orders">
                                <a>Orders</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/products">
                                <a className="font-bold">Products</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/users">Users</Link>
                        </li>
                    </ul>
                </div>

                <div className="overflow-x-auto md:col-span-3">
                    <div className="flex justify-between">
                        <h1 className="mb-4 text-xl">Products</h1>

                        {loadingDelete && <div>Deleting product...</div>}

                        <button
                            className="primary-button"
                            disabled={loadingAddNew}
                            onClick={addNewProductHandler}
                        >
                            {loadingAddNew ? "Loading..." : "Add New Product"}
                        </button>
                    </div>

                    {loading ? (
                        <div>
                            <BeatLoader color="#36d7b7" />
                        </div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">ID</th>
                                        <th className="p-5 text-left">NAME</th>
                                        <th className="p-5 text-left">PRICE</th>
                                        <th className="p-5 text-left">
                                            CATEGORY
                                        </th>
                                        <th className="p-5 text-left">COUNT</th>
                                        <th className="p-5 text-left">
                                            RATING
                                        </th>
                                        <th className="p-5 text-left">
                                            ACTION
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map((product) => (
                                        <tr
                                            key={product._id}
                                            className="border-b"
                                        >
                                            <td className="p-5">
                                                {product._id.substring(20, 24)}
                                            </td>

                                            <td className="p-5">
                                                {product.name}
                                            </td>

                                            <td className="p-5">
                                                ${product.price}
                                            </td>

                                            <td className="p-5">
                                                {product.category}
                                            </td>

                                            <td className="p-5">
                                                {product.countInStock}
                                            </td>

                                            <td className="p-5">
                                                {product.rating}
                                            </td>

                                            <td className="p-5">
                                                <Link
                                                    href={`/admin/product/${product._id}`}
                                                    passHref
                                                >
                                                    <a
                                                        type="button"
                                                        className="default-button"
                                                    >
                                                        Edit
                                                    </a>
                                                </Link>
                                                &nbsp;
                                                <Link href="#">
                                                    <a
                                                        onClick={() =>
                                                            deleteProductHandler(
                                                                product._id
                                                            )
                                                        }
                                                        type="button"
                                                        className="default-button"
                                                    >
                                                        Delete
                                                    </a>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
export default Products;

Products.auth = { adminOnly: true };