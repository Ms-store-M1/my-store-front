"use client"

import Header from '@/components/partials/Header';
import Footer from '@/components/partials/Footer';
import '@/assets/styles/style.scss';
import { DM_Serif_Display, Work_Sans } from 'next/font/google';
import { useEffect, useState } from 'react';
import useAuthStore from '@/stores/authStore';

const dm_serif_display = DM_Serif_Display({
    subsets: ['latin'],
    weight: ['400']
});

const work_sans = Work_Sans({
    subsets: ['latin'],
    weight: ['400', '700', '600', '900']
});

export default function RootLayout({ children }) {
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const { checkLogin } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            const userData = await checkLogin();
            if (userData) {
                setUserId(userData.userId); // Set userId if user is logged in
                setIsAdmin(userData.isAdmin); // Set isAdmin based on user role
            }
        };
        fetchData();
    }, []);

    return (
        <html lang="en">
            <body className={`${dm_serif_display.className} ${work_sans.className}`}>
                {/* Pass userId and isAdmin as props to Header component */}
                <Header userId={userId} isAdmin={isAdmin} /> 
                <main>
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
