import '@/app/(frontend)/styles/global.css';
import '@/app/(frontend)/styles/pages.css';
import '@/app/(frontend)/styles/tokens.css';

export default function AuthLayout({
    children,
}: { children: React.ReactNode }): React.ReactNode {
    return (
        <html lang="pt">
            <body className='auth-body'>{children}</body>
        </html>
    )
}