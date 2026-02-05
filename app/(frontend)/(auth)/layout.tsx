import { Toaster } from 'react-hot-toast';

export default function AuthLayout({
    children,
}: { children: React.ReactNode }): React.ReactNode {
    return (
        <>
            <Toaster />
            <div className="auth-layout" >
                {children}
            </div>
        </>
    )
}