import { Geist, Geist_Mono, Manrope, Montserrat, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: "4th Lion Admin Panel",
  description: "Admin panel for 4th Lion, built with Next.js and React.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${montserrat.variable} ${manrope.variable}`}>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
