import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
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
                users: action.payload,
                error: "",
            };

        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };


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
            return { ...state, loadingDelete: false, successDelete: false };

        default:
            return state;
    }
}

const Users = () => {

    const [{ loading, loadingDelete, error, users, successDelete }, dispatch] = useReducer(reducer, { loading: true, users: [], error: "" });

    const fetchData = async () => {
        try {
            dispatch({ type: "FETCH_REQ" });

            const { data } = await axios.get('/api/admin/users');

            dispatch({ type: "FETCH_SUCCESS", payload:data });
        } catch (error) {
            dispatch({ type: "FETCH_FAIL", payload: getError(error) });
            
            toast.error(getError(error))
        }
    }

    useEffect(() => {
        if (successDelete) {
            dispatch({ type: "DELETE_RESET" });
        } else {
            fetchData()
        }
    }, [successDelete])
    
    const deleteUserHandler = async (id) => {
        if (!window.confirm('Are you sure about this?')) {
            return;
        }

        try {
            dispatch({ type: "DELETE_REQ" });

            await axios.delete(`/api/admin/users/${id}`);

            dispatch({ type: "DELETE_SUCCESS" });

            toast.success('Done! User deleted')
        } catch (error) {
            dispatch({ type: "DELETE_FAIL" });
            toast.error(getError(error))
        }
    }


    return (
        <Layout title="Users">
            <div className="grid md:grid-cols-4 md:gap-5">
                <div>
                    <ul>
                        <li>
                            <Link href="/admin/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/admin/orders">Orders</Link>
                        </li>
                        <li>
                            <Link href="/admin/products">Products</Link>
                        </li>
                        <li>
                            <Link href="/admin/users">
                                <a className="font-bold">Users</a>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="overflow-x-auto md:col-span-3">
                    <h1 className="mb-4 text-xl">Users</h1>

                    {loadingDelete && <div>Deleting user...</div>}

                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">ID</th>
                                        <th className="p-5 text-left">NAME</th>
                                        <th className="p-5 text-left">EMAIL</th>
                                        <th className="p-5 text-left">ADMIN</th>
                                        <th className="p-5 text-left">
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users?.map((user) => (
                                        <tr key={user._id} className="border-b">
                                            <td className="p-5">
                                                {user._id.substring(20, 24)}
                                            </td>

                                            <td className="p-5">{user.name}</td>

                                            <td className="p-5">
                                                {user.email}
                                            </td>

                                            <td className="p-5">
                                                {user.isAdmin ? "Yes" : "No"}
                                            </td>

                                            <td className="p-5">
                                                <Link
                                                    href={`/admin/user/${user._id}`}
                                                >
                                                    <a
                                                        type="button"
                                                        className="default-button"
                                                    >
                                                        Edit
                                                    </a>
                                                </Link>
                                                &nbsp;
                                                <button
                                                    onClick={() =>
                                                        deleteUserHandler(id)
                                                    }
                                                >
                                                    <a
                                                        type="button"
                                                        className="default-button"
                                                    >
                                                        Delete
                                                    </a>
                                                </button>
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
export default Users;

Users.auth = { adminOnly: true };