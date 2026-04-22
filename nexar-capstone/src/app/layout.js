import React from "react";
import "./global.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";


export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#6366f1",
};


export const metadata = {
    title: {
        template: '%s | Nexar',
        default: 'Nexar - Student Focus OS',
    },
    description: "Nexar helps students organize, prioritize, and optimize academic life with high-precision focus sessions.",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Nexar",
      },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased">
                <ServiceWorkerRegistration />
                
                {children}
            </body>
        </html>
    );
}