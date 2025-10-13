import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PublicHeader = ({ link, title }) => {
  return (
    <header className="border-b border-slate-800 sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href={link}>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {title}
          </Button>
        </Link>
        <Link href={"/"} className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Creatr Logo"
            width={96}
            height={32}
            className="h-8 sm:h-10 md:h-11 w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
};

export default PublicHeader;