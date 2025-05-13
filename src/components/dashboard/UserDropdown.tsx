"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { signOut } from "next-auth/react";  
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function UserDropdown({ user }: { user?: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            {user?.name?.charAt(0) || <User className="h-4 w-4" />}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="p-2">
          <p className="text-sm font-medium">{user?.name || "User"}</p>
          <p className="text-xs text-muted-foreground">
            {user?.email || "No email"}
          </p>
        </div>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="w-full cursor-pointer">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          // onClick={() => signOut()}
          className="w-full cursor-pointer text-red-600 focus:text-red-600"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}