import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import HydrationProvider from "@/components/providers/HydrationProvider";
import LenisProvider from "@/components/providers/LenisProvider";
import AnimatedCursor from "@/components/providers/AnimatedCursorProvider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "AIUB HRMS — Human Resource Management System",
  description: "American International University-Bangladesh HR Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="aiub" className={jakarta.variable}>
      <body className="font-body antialiased bg-base-100 text-base-content">
        <HydrationProvider>
          <LenisProvider>
            <AnimatedCursor />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                },
                success: { iconTheme: { primary: "var(--color-success)", secondary: "#fff" } },
                error: { iconTheme: { primary: "var(--color-danger)", secondary: "#fff" } },
              }}
            />
          </LenisProvider>
        </HydrationProvider>
      </body>
    </html>
  );
}
