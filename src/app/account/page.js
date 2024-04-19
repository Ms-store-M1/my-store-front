"use client";

import SignupForm from "@/components/forms/SignupForm";
import { useEffect, useState } from "react";
import Button from "@/components/UI/Button";
import Profile from "@/components/account/Profile";
import useAuthStore from "@/stores/authStore";
import profileTabs from "@/data/profileTabs.json";
import Wishlist from "@/components/account/Wishlist";
import Orders from "@/components/account/Orders";
import LoginForm from "@/components/forms/LoginForm";
import menu from "@/data/menu.json";


export default function Account() {
    const { isLogged, accountInfo, isAdmin, checkLogin, login } = useAuthStore();
    // const login = useAuthStore((state) => state.login);
    // const checkLogin = useAuthStore((state) => state.checkLogin);

    const [loading, setLoading] = useState(true);
    const [showSignup, setShowSignup] = useState(false);
    const [isSignupSuccess, setIsSignupSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [error, setError] = useState(false);

    const handleSignupSuccess = (success, data) => {
        setIsSignupSuccess(success);
        if (success) {
            setShowSignup(false);
            login(data);
        } else {
        }
    };

    const handleLoginSuccess = (success, data) => {
        if (success) {
            login(data);
        } else {
            setError(true);
        }
    };

    const handleTyping = () => {
        if (error) {
            setError(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        const checkLoginStatus = async () => {
            try {
                await checkLogin();
                console.log("isAdmin", isAdmin);
            } catch (error) {
                console.error(
                    "Erreur lors de la vérification du login :",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, [setLoading, checkLogin, isAdmin]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full px-2 bg-gray-50">
            <div>
                <h1 className="text-3xl font-bold pt-2 pl-2">monespace.</h1>
            </div>
            <div className="flex  justify-around w-full">
                <div className="w-1/4 p-5">
                    {isLogged && (
                        <nav className="flex flex-col mt-16">
                            {profileTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`p-2 bg-transparent text-black ${
                                        activeTab === tab.id
                                            ? "border border-black"
                                            : ""
                                    }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    )}
                </div>
                <div className="w-3/4 max-w-2xl p-5 ">
                    {isLogged && (
                    <>
                        {activeTab === 'profile' && (
                        <div>
                            <Profile accountInfo={accountInfo} />
                        </div>
                        )}
                        {activeTab === 'orders' && (
                        <div>
                            <Orders />
                        </div>
                        )}
                        {activeTab === 'wishlist' && (
                            <Wishlist wishlist={accountInfo.wishlist} />
                        )}
                    </>
                    )}
                </div>
            </div>
            {!isLogged && (
                <div className="flex items-center justify-center">
                    <div className="p-5 w-3/5">
                        {!showSignup ? (
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Connexion
                                </h2>
                                {error && (
                                    <div
                                        className="my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                        role="alert"
                                    >
                                        <strong className="font-bold">
                                            Erreur !
                                        </strong>
                                        <span className="block sm:inline">
                                            Email ou mot de passe incorrect.
                                        </span>
                                    </div>
                                )}
                                <LoginForm
                                    onTyping={handleTyping}
                                    onLoginSuccess={handleLoginSuccess}
                                />
                                <div className="mt-2">
                                    <p>
                                        Pas de compte ?
                                        <a
                                            className="ml-1 text-md font-normal leading-6 text-black text-base hover:text-slate-500 cursor-pointer"
                                            onClick={() => setShowSignup(true)}
                                        >
                                            Inscription
                                        </a>
                                    </p>
                                </div>{" "}
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Inscription
                                </h2>
                                {isSignupSuccess === false && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                        role="alert"
                                    >
                                        <strong className="font-bold">
                                            Erreur !
                                        </strong>
                                        <span className="block sm:inline">
                                            Une erreur s'est produite lors de
                                            l'inscription.
                                        </span>
                                    </div>
                                )}
                                <SignupForm
                                    onTyping={handleTyping}
                                    onSignupSuccess={handleSignupSuccess}
                                />
                                {/* already have an account div */}
                                <div className="mt-2">
                                    <p>
                                        Vous avez déjà un compte ?
                                        <a
                                            className="ml-1 text-md font-normal leading-6 text-black text-base hover:text-slate-500 cursor-pointer"
                                            onClick={() => setShowSignup(false)}
                                        >
                                            Connexion
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
