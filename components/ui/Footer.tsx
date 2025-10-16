import React from "react";
import { Separator } from "./Seperator";
import { Link } from "next-view-transitions";
import Image from "next/image";



export default function Footer() {
  return (
    <footer className="mt-10 mb-5 flex w-full flex-col items-center justify-center gap-6">
      <Separator className="w-full max-w-6xl" />
     
      <div className="text-muted-foreground text-sm">
        © 2025 Ournotes.
      </div>
      <div className="font-excon relative text-5xl font-black tracking-tighter text-nowrap opacity-15 lg:text-9xl">
        <Image
          src="/doodles/superman.svg"
          width={200}
          height={50}
          alt="Ournotes"
          className="absolute -top-12 -right-14 size-16 md:-top-16 md:-right-22 md:size-28"
        />
        Ournotes
      </div>
      <div className="group flex items-center gap-2">
        <Image
          className="hidden size-12 rounded-2xl border border-gray-400 group-hover:border-2 md:block"
          src="/rakesh.jpg"
          width={48}
          height={48}
          alt="Ram"
        />
        <p className="opacity-50 transition-all duration-300 ease-in-out group-hover:opacity-100">
          <Link target="_blank" href="https://www.rakeshpaulraj.me">
            Build with ❤️{" "}
            <span className="transition-all duration-300 ease-in-out group-hover:underline">
             Rakesh
            </span>
          </Link>
        </p>
      </div>
    </footer>
  );
}
