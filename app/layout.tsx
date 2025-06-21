
import './globals.css';
import { Inter } from 'next/font/google';
import Layout from '../components/layout/Layout';
import dynamic from 'next/dynamic';


const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Collaborative Notes App',
//   description: 'A real-time collaborative notes application',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
