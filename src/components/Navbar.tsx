"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  const user: User = session?.user as User;

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 md:py-6">
          <a
            href="#"
            className="text-2xl md:text-3xl font-black tracking-tight hover:text-gray-300 transition-colors duration-200 mb-4 md:mb-0"
          >
            Mystery Message
          </a>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {session ? (
              <>
                <div className="flex items-center gap-2 text-gray-300">
                  <UserIcon className="h-5 w-5" />
                  <span className="text-sm md:text-base">
                    {user?.username || user?.email}
                  </span>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="w-full md:w-auto bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button className="w-full md:w-auto bg-white text-black hover:bg-gray-200 transition-colors duration-200">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
