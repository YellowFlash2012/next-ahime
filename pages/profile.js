import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import getError from "../utils/error";

const Profile = () => {
    const { data: session } = useSession();

    const { handleSubmit, register, getValues, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        setValue('name', session.user.name);
        setValue('email', session.user.email);
    }, [session.user, setValue])
    
    const updateProfileHandler = async ({ name, email, password}) => {
        try {
            await axios.put('/api/auth/update', {
                name,email,password
            })

            const res = await signIn('credentials', { redirect: false, email, password });

            toast.success("Profile updated successfully!")

            if (res.error) {
                toast.error(res.error)
            }
        } catch (error) {
            toast.error(getError(error))
        }
    }
    return (
        <Layout title="Profile">
            <form
                className="mx-auto max-w-screen-md"
                onSubmit={updateProfileHandler}
            >
                <h1 className="mb-4 text-xl">Update Profile</h1>

                <div className="mb-4">
                    <label htmlFor="name">Name</label>

                    <input
                        type="text"
                        id="name"
                        className="w-full"
                        autoFocus
                        {...register("name", {
                            required: "Please enter your name",
                        })}
                    />

                    {errors.name && (
                        <div className="text-red-500">
                            {errors.name.message}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="email">Email</label>

                    <input
                        type="email"
                        id="email"
                        className="w-full"
                        {...register("email", {
                            required: "Please enter your email",
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                                message: "Please enter a valid email address",
                            },
                        })}
                    />

                    {errors.email && (
                        <div className="text-red-500">
                            {errors.name.message}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="password">Password</label>

                    <input
                        type="password"
                        id="password"
                        className="w-full"
                        {...register("password", {
                            required: "Please enter new password",
                            minLength: {
                                value: 13,
                                message:
                                    "Password should be at least 13 characters",
                            },
                        })}
                    />

                    {errors.password && (
                        <div className="text-red-500">
                            {errors.password.message}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="cpassword">Confirm Password</label>

                    <input
                        type="password"
                        id="cpassword"
                        className="w-full"
                        {...register("cpassword", {
                            validate: (value) =>
                                value === getValues("password"),
                            minLength: {
                                value: 13,
                                message:
                                    "Password should be at least 13 characters",
                            },
                        })}
                    />

                    {errors.cpassword && (
                        <div className="text-red-500">
                            {errors.cpassword.message}
                        </div>
                    )}
                    
                    {errors.cpassword && errors.confirmPassword.type==='validate' && (
                        <div className="text-red-500">
                            Passwords do NOT match!
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <button className="primary-button">Update Profile</button>
                </div>
            </form>
        </Layout>
    );
};
export default Profile;

Profile.auth = true;