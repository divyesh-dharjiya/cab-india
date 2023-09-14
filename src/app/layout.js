import './globals.css';
import { Inter } from 'next/font/google';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Chakra from './components/chakra';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CAB India',
  description: 'Indian CAB Facility.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Chakra>
          <Header />
          {children}
          <Footer />
        </Chakra>
      </body>
    </html>
  )
}
