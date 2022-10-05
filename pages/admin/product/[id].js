import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";
import getError from "../../../utils/error";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQ':
            return { ...state, loading: true, error: "" };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, error: "" };
        case "FETCH_FAIL":
            return {...state, loading:false, error:action.payload}
        
        case 'UPDATE_REQ':
            return { ...state, loadingUpdate: true, errorUpdate: "" };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false, errorUpdate: "" };
        case "UPDATE_FAIL":
            return {
                ...state,
                loadingUpdate: false,
                errorUpdate: action.payload,
            };
        
        case 'UPLOAD_REQ':
            return { ...state, loadingUpload: true, errorUpload: "" };
        case 'UPLOAD_SUCCESS':
            return { ...state, loadingUpload: false, errorUpload: "" };
        case "UPLOAD_FAIL":
            return {...state, loadingUpload:false, errorUpload:action.payload}
    
        default:
            return state;
    }
}

const ProductEditByAdmin = () => {
    const { query } = useRouter();
    const router = useRouter();

    const productID = query.id;

    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, { loading: true, error: "" });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const fetchData = async () => {
        try {
            dispatch({ type: 'FETCH_REQ' });

            const { data } = await axios.get(`/api/admin/products/${productID}`);

            dispatch({ type: "FETCH_SUCCESS" });

            setValue('name', data.name);
            setValue('slug', data.slug);
            setValue('price', data.price);
            setValue('image', data.image);
            setValue('category', data.category);
            setValue('brand', data.brand);
            setValue("countInStock", data.countInStock);
            setValue("description", data.description);
        } catch (error) {
            dispatch({ type: "FETCH_FAIL", payload:getError(error) });
        }
    }

    useEffect(() => {
        fetchData()
    }, [productID, setValue])

    const uploadImageHandler = async (e, imageField = 'image') => {
        const url = `https://api/cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

        try {
            dispatch({ type: "UPLOAD_REQ" });

            const { data: { signature, timestamp } } = await axios.get("/api/admin/cloudinary-sign");

            const file = e.target.files[0];

            const formData = new FormData();

            formData.append('file', file);
            formData.append("signature", signature);
            formData.append("timestamp", timestamp);
            formData.append(
                "api_key",
                process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
            );

            const { data } = await axios.post(url, formData);

            dispatch({ type: UPLOAD_SUCCESS });

            setValue(imageField, data.secure_url);

            toast.success("Success! Your file was uploaded")
        } catch (error) {
            dispatch({ type: "UPLOAD_FAIL", payload: getError(error) });

            toast.error(getError(error));
        }
    }

    const editProductHandler = async ({ name, slug, price, category, image, brand, countInStock, description }) => {
        try {
            dispatch({ type: "UPDATE_REQ" });

            await axios.put(`/api/admin/products/${productID}`, {
                name,
                slug,
                price,
                category,
                image,

                brand,
                countInStock,
                description,
            });

            dispatch({ type: "UPDATE_SUCCESS" });

            toast.success(`${productID} has been updated!`);

            router.push('/admin/products')
        } catch (error) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(error) });
            
            toast.error(getError(error));
        }
    }
    
    return (
        <Layout title={`Edit Product ${productID}`}>
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

                <div className="md:col-span-3">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <form
                            className="mx-auto max-w-screen-md"
                            onSubmit={handleSubmit(editProductHandler)}
                        >
                            <h1 className="mb-4 text-xl">{`Edit product ${productID}`}</h1>

                            <div className="mb-4">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    id="name"
                                    autoFocus
                                    {...register("name", {
                                        required:
                                            "Please enter the product's name",
                                    })}
                                />

                                {errors.name && (
                                    <div className="text-red-500">
                                        {errors.name.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="slug">Slug</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    id="slug"
                                    {...register("slug", {
                                        required:
                                            "Please enter the product's slug",
                                    })}
                                />

                                {errors.slug && (
                                    <div className="text-red-500">
                                        {errors.slug.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    className="w-full"
                                    id="price"
                                    {...register("price", {
                                        required:
                                            "Please enter the product's price",
                                    })}
                                />

                                {errors.price && (
                                    <div className="text-red-500">
                                        {errors.price.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="image">image</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    id="image"
                                    {...register("image", {
                                        required:
                                            "Please enter the product's image",
                                    })}
                                />

                                {errors.image && (
                                    <div className="text-red-500">
                                        {errors.image.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="imageFile">
                                    Upload Image File
                                </label>

                                <input
                                    type="file"
                                    name="imageFile"
                                    id="imageFile"
                                    className="w-full"
                                    onChange={uploadImageHandler}
                                />

                                        {loadingUpload && <div>Uploading...</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="category">Category</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    id="category"
                                    {...register("category", {
                                        required:
                                            "Please enter the product's category",
                                    })}
                                />

                                {errors.category && (
                                    <div className="text-red-500">
                                        {errors.category.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="brand">Brand</label>

                                <input
                                    type="text"
                                    className="w-full"
                                    id="brand"
                                    {...register("brand", {
                                        required:
                                            "Please enter the product's brand",
                                    })}
                                />

                                {errors.brand && (
                                    <div className="text-red-500">
                                        {errors.brand.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description">Description</label>

                                <input
                                    type="text"
                                    className="w-full"
                                    id="description"
                                    {...register("description", {
                                        required:
                                            "Please enter the product's description",
                                    })}
                                />

                                {errors.description && (
                                    <div className="text-red-500">
                                        {errors.description.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="countInStock">
                                    Count In Stock
                                </label>

                                <input
                                    type="number"
                                    className="w-full"
                                    id="countInStock"
                                    {...register("countInStock", {
                                        required:
                                            "Please enter the product's count",
                                    })}
                                />

                                {errors.countInStock && (
                                    <div className="text-red-500">
                                        {errors.countInStock.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <button
                                    className="primary-button"
                                    disabled={loadingUpdate}
                                >
                                    {loadingUpdate
                                        ? "loading..."
                                        : "Update Product"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
};
export default ProductEditByAdmin

ProductEditByAdmin.auth = { adminOnly:true };