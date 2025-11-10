import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ThemeRegistry from '@/components/ThemeRegistry';


export const metadata: Metadata = {
  title: "Bug Tracking System",
  description: "Bug Tracking System",
};

export default function RootLayout( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            { children }
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
