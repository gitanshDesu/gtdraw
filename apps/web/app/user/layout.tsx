import { ModeToggle } from "@/components/DarkModeToggle";
import { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className=" flex justify-end relative top-4 right-4 sm:top-8 sm:right-8">
        <ModeToggle />
      </div>
      {children}
    </>
  );
}
