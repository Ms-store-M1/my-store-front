"use client"

import Header from '@/components/partials/Header';
import Footer from '@/components/partials/Footer';
import '@/assets/styles/style.scss';
import { DM_Serif_Display, Work_Sans } from 'next/font/google';
import { useEffect } from 'react';
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

    const { checkLogin } = useAuthStore();

    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <html lang="en">
            <body className={`${dm_serif_display.className} ${work_sans.className}`}>
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
