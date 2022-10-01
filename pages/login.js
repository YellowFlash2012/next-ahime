import Layout from "../components/Layout";
import Link from "next/link";
import { useForm } from "react-hook-form";

import {signIn, useSession} from 'next-auth/react'
import { toast } from "react-toastify";
import getError from "../utils/error";
import { useEffect } from "react";
import { useRouter } from "next/router";


const Login = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if (session?.user) {
            router.push(redirect || "/");
        }
    }, [session?.user, redirect, router]);
        
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const loginHandler = async ({ email, password }) => {
        console.log(email, password);

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password
            })

            if (res.error) {
                toast.error(res.error)
            }
        } catch (error) {
            toast.error(getError(err))
        }
    }

    return (
        <Layout title="login">
            <form
                className="mx-auto max-w-screen-md"
                onSubmit={handleSubmit(loginHandler)}
            noValidate
            >
                <h1 className="mb-4 text-xl">Login</h1>

                <div className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Your email address is required!",
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                                message: "Please enter a valid email address",
                            },
                        })}
                        className="w-full"
                        
                        id="email"
                        placeholder="Enter your email..."
                        autoFocus
                    />
                    {errors.email && (
                        <div className="text-red-500">
                            {errors.email.message}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Your password is required",
                            minLength: {
                                value: 13,
                                message:
                                    "Password should be at least 13 characters",
                            },
                        })}
                        className="w-full"
                        
                        id="password"
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <div className="text-red-500">
                            {errors.password.message}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <button className="primary-button">Login</button>
                </div>

                <div className="mb-4">
                    <p>
                        Don&apos;t have an account yet?&nbsp;{" "}
                        <Link href="/register">
                            <a className="font-bold text-blue-500">Register</a>
                        </Link>
                    </p>
                </div>
            </form>
        </Layout>
    );
};
export default Login;
