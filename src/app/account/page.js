"use client";

import SignupForm from "@/components/forms/SignupForm";
import { useState } from "react";
import Button from "@/components/UI/Button";
import Profile from "@/components/account/Profile";
import useAuthStore from "@/stores/authStore";
import profileTabs from "@/data/profileTabs.json";
import Wishlist from "@/components/account/Wishlist";
import Orders from "@/components/account/Orders";
import LoginForm from "@/components/forms/LoginForm";

export default function Account() {

    const { isLogged, accountInfo } = useAuthStore();
    const login = useAuthStore(state => state.login);

    const [showSignup, setShowSignup] = useState(false);
    const [isSignupSuccess, setIsSignupSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState('profile'); 

    const handleSignupSuccess = (success, data) => {
        setIsSignupSuccess(success);
        if (success) {
            console.log('Inscription réussie avec les données :', data);
            // setShowSignup(false);
            // login(data);
        } else {
        }
      };

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
                            className={`p-2 bg-transparent text-black ${activeTab === tab.id ? 'border border-black' : ''}`}
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
                            <Wishlist />
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
                                <h2 className="text-2xl font-bold">Connexion</h2>
                                <LoginForm />
                                <div className="mt-2">
                                    <p>Pas de compte ?
                                    <a className="ml-1 text-md font-normal leading-6 text-black text-base hover:text-slate-500 cursor-pointer" onClick={() => setShowSignup(true)}>Inscription</a>
                                    </p>
                                </div>                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold">Inscription</h2>
                                <SignupForm onSignupSuccess={handleSignupSuccess} />
                                {/* already have an account div */}
                                <div className="mt-2">
                                    <p>Vous avez déjà un compte ?
                                    <a className="ml-1 text-md font-normal leading-6 text-black text-base hover:text-slate-500 cursor-pointer" onClick={() => setShowSignup(false)}>Connexion</a>
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
