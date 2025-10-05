import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const description = `
SkyGuard is an interactive platform that brings space science to life by visualizing real asteroid impact scenarios using NASA data. Users can explore how asteroids travel through space, simulate what would happen if it one struck Earth, and see the potential effects — crater formation, seismic effects, and atmospheric changes.
The tool lets users adjust variables such as asteroid density, impact angle, and distance from impact center, then instantly see how those changes alter outcomes. By combining scientific accuracy with intuitive design, dynamic visuals, and explanatory tooltips, the platform turns complex impact modeling into an accessible experience. It empowers the public, educators, and decision-makers to better understand asteroid threats and explore possible ways to protect our planet.
`;

export const metadata: Metadata = {
  title: "SpaceCrammers",
  description,
  openGraph: {
    title: "SpaceCrammers",
    description,
    url: "https://2025.space-crammers.earth",
    siteName: "SpaceCrammers",
    images: [
      {
        url: "/opengraph.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en" style={{ colorScheme: "dark" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased min-h-screen`}
      >
        <Toaster richColors={true} closeButton={true} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="mt-8 sm:px-8">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
