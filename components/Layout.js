import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

const Layout = ({ title, children }) => {
    const [date, setDate] = useState();

    useEffect(() => {
        setDate(new Date().getFullYear());
    }, [])

    return (
        <>
            <Head>
                <title>{title ? title + " - Next-Ahime" : "Next-Ahime"}</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/cart-variant.png" />
            </Head>

            <div className="flex flex-col justify-between min-h-screen">
                <header>
                    <nav className="flex h-12 justify-between items-center shadow-md px-4">
                        <Link href="/">
                            <a className="text-lg font-bold">next-ahime</a>
                        </Link>

                        <div>
                            <Link href="/cart">
                                <a className="p-2 hover:underline decoration-2">
                                    Cart
                                </a>
                            </Link>

                            <Link href="/login">
                                <a className="p-2 hover:bg-sky-700">Login</a>
                            </Link>
                        </div>
                    </nav>
                </header>

                <main className="container m-auto mt-4 px-4">{children}</main>

                <footer className="flex h-10 justify-center items-center shadow-inner">
                    <p>
                    Copyright &copy; {date} - next-ahime

                    </p>
                </footer>
            </div>
        </>
    );
};
export default Layout;