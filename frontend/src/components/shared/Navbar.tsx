import { Bell } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-gray-800 px-6 flex items-center justify-end gap-4 bg-black">
    <div className="relative">
      <Bell className="text-white" size={20} />
      <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
    </div>
    <div className="w-8 h-8 rounded-full bg-gray-300" />
  </header>
  );
}
