import React from "react";

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
};

export default function RootLayout ({ children }) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content={Object.entries(viewport).map(([key, value]) => `${key}=${value}`).join(", ")} />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}