"use client";

import SignupForm from "@/components/forms/SignupForm";
import { useState } from "react";
import Button from "@/components/UI/Button";
import Profile from "@/components/account/Profile";
import useAuthStore from "@/stores/authStore";
import profileTabs from "@/data/profileTabs.json";
import Wishlist from "@/components/account/Wishlist";
import Orders from "@/components/account/Orders";

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
            setShowSignup(false);
            login(data);
        } else {
        }
      };

    return (
        <div className="min-h-screen flex w-full mx-2 items-center justify-center bg-gray-50">
             <div className="w-1/4 p-5">
                {isLogged && (
                <nav className="flex flex-col">
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
                {isLogged ? (
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
                ) 
                 : (
                    <>
                        {showSignup ? (
                            <div>
                                <h2>Inscription</h2>
                                {isSignupSuccess === false && <p>Échec de l'inscription, veuillez vérifier vos informations.</p>}
                                <SignupForm onSignupSuccess={handleSignupSuccess}/>
                                <p>Vous avez déjà un compte ?</p>
                                <a className={`text-md font-normal leading-6 text-black text-base hover:text-slate-500 cursor-pointer`} onClick={() => setShowSignup(false)}>Se connecter</a>
                            </div>
                        ) : (
                            <div>
                                <h2>Login</h2>
                                <p>Vous n'avez pas de compte ?</p>
                                <Button onClick={() => setShowSignup(true)}>S'inscrire</Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
