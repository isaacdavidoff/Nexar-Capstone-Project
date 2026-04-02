import React from "react";
import "./global.css";

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
};

export const metadata = {
    title: "Nexar - Your AI-Powered Task Manager",
    description: "Nexar is an AI-powered task management application designed to help you organize, prioritize, and optimize your daily tasks. With intelligent recommendations and a user-friendly interface, Nexar makes it easier than ever to stay on top of your responsibilities and boost your productivity.",
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