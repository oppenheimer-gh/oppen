import { useAuthContext } from "@/components/contexts";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const { user, logout } = useAuthContext();

  const signOut = async () => {
    await logout();
  };

  return (
    <nav className="z-50 sticky inset-0 px-6 py-4 flex items-center justify-between">
      <Link href={"/"}>
        <span className="font-semibold text-xl flex items-center gap-1">
          connect <div className="rounded-full bg-slate-400 p-1" />
          <div className="rounded-full bg-slate-600 p-1" /> two
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <Link href={"/about"}>About</Link>
        {!user ? (
          <>
            <Link
              href={"/register"}
              className={buttonVariants({ variant: "secondary" })}
            >
              Register
            </Link>
            <Link
              href={"/login"}
              className={buttonVariants({ variant: "default" })}
            >
              Login
            </Link>{" "}
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className={`w-[50px] h-[50px] hover:shadow-lg`}>
                <AvatarImage src={user.profile_photo_url} />
                <AvatarFallback>PC</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user.is_mentor
                  ? `Ready to share and teach, ${user.username}?`
                  : `On a mood to socialize and learn, ${user.username}?`}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onClick={signOut}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};
