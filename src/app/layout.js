"use client";
import { useEffect, useState } from 'react';
import './globals.css';
import { usePathname } from "next/navigation";
import { Inter } from 'next/font/google';
import SplashScreen from './components/splash-screen/spalsh-screen';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Chakra from './components/chakra';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CAB India',
  description: 'Indian CAB Facility.',
}

export default function RootLayout({ children }) {
  const pathName = usePathname();
  const isHome = pathName === "/home";
  const [isLoading, setIsLoading] = useState(isHome);

  useEffect(() => {
    if (isLoading) {
      return;
    }
  }, [isLoading]);
  return (
    <html lang="en">
      <body className={inter.className}>
        {isLoading && isHome ? (
          <SplashScreen finishLoading={() => setIsLoading(false)} />
        ) : (
          <Chakra>
            <Header />
            {children}
            <Footer />
          </Chakra>
        )}
      </body>
    </html>
  )
}
