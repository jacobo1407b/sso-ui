import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Providers } from "../providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Layout } from "@/components/layout";


export const metadata: Metadata = {
  title: {
    default: "SSO UI",
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <Layout>
            {children}
          </Layout>  
        </Providers>
      </body>
    </html>
  );
}

//container mx-auto max-w-7xl pt-16 px-6 flex-grow

/**
 * <div className="relative flex flex-col h-screen">
            <Sidebar isOpen={true} />
            <Navbar />
            <main className="">
              
            </main>

          </div>
 */