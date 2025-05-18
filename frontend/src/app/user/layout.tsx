import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { userNavItems } from "@/lib/constants/index";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar navItems={userNavItems} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-zinc-900 text-white">{children}</main>
      </div>
    </div>
  );
}
