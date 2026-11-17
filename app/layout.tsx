import type { Metadata, Viewport } from "next";
import { Baloo_2, Fredoka, Poppins, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSansMalayalam = Noto_Sans_Malayalam({
  variable: "--font-malayalam",
  subsets: ["malayalam"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Midhula Farm Hut | Ornamental Fish Farm Thrissur | Live Shipping Across India",
  description:
    "Exotic farm-bred guppies, high-fin platies, swordtails, freshwater dwarf crayfish and red cherry shrimp raised in natural open-air Kerala waters. Shipped safely with 100% Live Arrival Guarantee.",
  keywords: [
    "Midhula Farm Hut",
    "ornamental fish Kerala",
    "guppy farm Thrissur",
    "Nooluvally fish farm",
    "buy guppy online India",
    "exotic platies",
    "swordtail fish",
    "freshwater crayfish India",
    "red cherry shrimp live shipping",
    "aquarium fish delivery",
  ],
  authors: [{ name: "Midhula Farm Hut", url: "https://midhulafarmhut.com" }],
  creator: "Midhula Farm Hut",
  metadataBase: new URL("https://midhulafarmhut.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: "ml_IN",
    url: "https://midhulafarmhut.com",
    title: "Midhula Farm Hut — Colour that swims.",
    description:
      "Farm-bred guppies, platies, swordtails, crayfish and shrimp from Nooluvally, Thrissur. Shipped live across India.",
    siteName: "Midhula Farm Hut",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Midhula Farm Hut Circular Official Emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Midhula Farm Hut | Ornamental Fish Farm Thrissur",
    description: "Colour that swims. Farm-bred livebearers & crustaceans delivered live across India.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#06222E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${baloo2.variable} ${fredoka.variable} ${poppins.variable} ${notoSansMalayalam.variable} h-full antialiased selection:bg-[#FF6A1A]/30 selection:text-[#FF6A1A]`}
    >
      <body className="min-h-full flex flex-col bg-[#FFE9A8] text-[#0E2038]">
        {children}
      </body>
    </html>
  );
}
