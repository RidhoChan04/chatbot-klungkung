import "./globals.css";
import { Montserrat } from "next/font/google";
import { LanguageProvider } from "@/components/Language";
import SiteFrame from "@/components/SiteFrame";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotDock from "@/components/ChatbotDock";

/* Global font setup */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400","500","600","700"],
});

export const metadata = {
  title: "Discover Klungkung",
  description: "Klungkung Tourism website prototype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {/* Global providers and layout frame */}
        <LanguageProvider>
          <SiteFrame>
            {/* Global navigation */}
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
            {/* Global footer + chatbot */}
            <Footer />
            <ChatbotDock />
          </SiteFrame>
        </LanguageProvider>
      </body>
    </html>
  );
}
