import '@/app/(frontend)/styles/global.css';
import '@/app/(frontend)/styles/pages.css';
import '@/app/(frontend)/styles/tokens.css';
import '@/app/(frontend)/styles/components.css';
import {Inter} from 'next/font/google';

const inter = Inter({subsets: ['latin']});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return(
        <html lang="pt" className={inter.className}>
            <body>         
              {children}</body>
        </html>
    )
}