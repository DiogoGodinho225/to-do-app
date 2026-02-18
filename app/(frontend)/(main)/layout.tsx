'use client';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import Navbar from '../components/navbar';
import { ProjectsProvider } from '@/app/context/ProjectsContext';
import { UserProvider } from '@/app/context/UserContext';

export default function MainLayout({
    children,
}: { children: React.ReactNode }): React.ReactNode {
    return (
        <>
            <SessionProvider>
                <UserProvider>
                    <ProjectsProvider>
                        <Toaster />
                        <div className="main-layout">
                            <Navbar />
                            {children}
                        </div>
                    </ProjectsProvider>
                </UserProvider>
            </SessionProvider>
        </>
    )
}