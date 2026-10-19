import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import SplashScreen from "./components/splash-screen/splash-screen";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "CAB India — Book a cab anywhere in India",
  description: "Search pickup and drop locations, see the route and compare cab fares across India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <SplashScreen />
          <div className="app-shell">
            <Header />
            <main className="app-main">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
