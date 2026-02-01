import '@/app/(frontend)/styles/global.css';
import '@/app/(frontend)/styles/pages.css';
import '@/app/(frontend)/styles/tokens.css';

export default function AuthLayout({
    children,
}: { children: React.ReactNode }): React.ReactNode {
    return (
        <html lang="pt">
            <body>{children}</body>
        </html>
    )
}