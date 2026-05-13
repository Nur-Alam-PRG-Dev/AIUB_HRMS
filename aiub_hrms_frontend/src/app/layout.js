import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "AIUB HRMS — Human Resource Management System",
  description:
    "Production-ready HRMS for American International University-Bangladesh. Manage employees, payroll, leaves, and attendance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#166534", secondary: "#dcfce7" },
            },
            error: {
              iconTheme: { primary: "#ba1a1a", secondary: "#ffdad6" },
            },
          }}
        />
      </body>
    </html>
  );
}
