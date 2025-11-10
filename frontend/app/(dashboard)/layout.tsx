import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import ThemeRegistry from '@/components/ThemeRegistry';


export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function DashboardLayout( {
  children,
}: {
  children: React.ReactNode;
} ) {
  return (
    <>
      <ThemeRegistry>
        <AuthProvider>
          <Navbar />

          <main>{ children }</main>
        </AuthProvider>
      </ThemeRegistry>
    </>
  );
}
