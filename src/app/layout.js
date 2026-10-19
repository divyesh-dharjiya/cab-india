import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import SplashScreen, { SPLASH_SCRIPT } from "./components/splash-screen/splash-screen";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "CAB India — Book a cab anywhere in India",
  description: "Search pickup and drop locations, see the route and compare cab fares across India.",
};

export const viewport = {
  themeColor: "#F59E0B",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Runs before paint so returning visitors never see the splash flash. */}
        <script dangerouslySetInnerHTML={{ __html: SPLASH_SCRIPT }} />
      </head>
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
