import axios from "axios";
import Link from "next/link";

import { Bar } from "react-chartjs-2";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

import { BeatLoader } from "react-spinners";

import { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import getError from "../../utils/error";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options= {
    responsive: true,
    plugins: {
        legend: {
            position:'top'
        }
    }
}

function reducer(state,action) {
    switch (action.type) {
        case 'FETCH_REQ':
            
            return { ...state, loading: true, error: "" }
        
        case "FETCH_SUCCESS":
            return { ...state, loading: false, summary: action.payload, error: "" }
        
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
    
        default:
            state;
    }
}

const Dashboard = () => {
    const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
        loading: true,
        summary: { salesData: [] },
        error: ""
    });

    const fetchData = async () => {
        try {
            dispatch({ type: 'FETCH_REQ' });

            const { data } = await axios.get("/api/admin/summary");

            dispatch({ type: 'FETCH_SUCCESS', payload: data });

        } catch (error) {
            dispatch({type:"FETCH_FAIL", payload:getError(error)})
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    
    const data = {
        labels: summary.salesData.map(x => x._id),
        datasets: [
            {
                label: 'Sales',
                backgroundColor: 'rgba(162,222,208,1)',
                data:summary.salesData.map(x=>x.totalSales)
            }
        ]
    }

    return (
        <Layout title="Admin Dashboard">
            <div className="grid md:grid-cols-4 md:gap-5">
                <div>
                    <ul>
                        <li>
                            <Link href="/admin/dashboard">
                                <a className="font-bold">Dashboard</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/orders">Orders</Link>
                        </li>
                        <li>
                            <Link href="/admin/products">Products</Link>
                        </li>
                        <li>
                            <Link href="/admin/users">Users</Link>
                        </li>
                    </ul>
                </div>

                <div className="md:col-span-3">
                    <h1 className="mb-4 text-xl">Admin Dashboard</h1>

                    {loading ? (
                        <div>
                            <BeatLoader color="#36d7b7" />
                        </div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-4">
                                <div className="card m-5 p-5">
                                    <p className="text-3xl">
                                        ${summary.ordersAmount}
                                    </p>

                                    <p>Sales</p>

                                    <Link href="/admin/orders">View Sales</Link>
                                </div>

                                <div className="card m-5 p-5">
                                    <p className="text-3xl">
                                        {summary.ordersCount}
                                    </p>

                                    <p>Orders</p>

                                    <Link href="/admin/orders">
                                        View Orders
                                    </Link>
                                </div>

                                <div className="card m-5 p-5">
                                    <p className="text-3xl">
                                        {summary.productsCount}
                                    </p>

                                    <p>Products</p>

                                    <Link href="/admin/products">
                                        View Products
                                    </Link>
                                </div>

                                <div className="card m-5 p-5">
                                    <p className="text-3xl">
                                        {summary.usersCount}
                                    </p>

                                    <p>Users</p>

                                    <Link href="/admin/users">View Users</Link>
                                </div>
                            </div>

                            <h2 className="text-xl">Sales report</h2>

                            <Bar
                                options={{
                                    legend: {
                                        display: true,
                                        position: "right",
                                    },
                                }}
                                data={data}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
export default Dashboard;

Dashboard.auth = { adminOnly: true };