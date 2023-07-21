import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export const Navbar = () => {
  return (
    <nav className="sticky inset-0 px-6 py-4 flex items-center justify-between">
      <Link href={"/"}>
        <span className="font-semibold text-xl flex items-center gap-1">
          connect <div className="rounded-full bg-slate-500 p-1" /> two
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <Link href={"/about"}>About</Link>
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
        </Link>
      </div>
    </nav>
  );
};
