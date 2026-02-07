'use client';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import Navbar from '../components/navbar';

export default function MainLayout({
    children,
}: { children: React.ReactNode }): React.ReactNode {
    return (
        <>
            <SessionProvider>
                <Toaster />
                <div className="main-layout">
                    <Navbar />
                    {children}
                </div>
            </SessionProvider>
        </>
    )
}