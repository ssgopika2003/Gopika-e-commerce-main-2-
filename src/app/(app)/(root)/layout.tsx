import { SiteFooter } from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="font-outfit max-w-screen overflow-x-hidden">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
