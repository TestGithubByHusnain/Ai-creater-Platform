import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"]})

export const metadata = {
  title: "AI Content Platform",
  description: "",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
      >
        <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
        >
          <ClerkProvider 
            appearance={{
              baseTheme: shadesOfPurple,
            }}>
           <ConvexClientProvider>
          {/* Header */}
          <Header />
<main className="bg-slate-900 min-h-screen text-white overflow-x-hidden">
   {children}
</main>
           </ConvexClientProvider>
           </ClerkProvider>
        </ThemeProvider>
     
      </body>
    </html>
  );
}
