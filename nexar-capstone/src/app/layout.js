
export const metadata = {
  title: "My App",
  description: "Next.js App Router Example",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}