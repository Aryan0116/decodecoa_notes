
import React from "react";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface AdvancedLoaderProps {
  size?: "small" | "medium" | "large";
  text?: string;
  className?: string;
}

const AdvancedLoader = ({
  size = "medium",
  text = "Loading...",
  className,
}: AdvancedLoaderProps) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        <div className={cn("relative animate-spin", sizeClasses[size])}>
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-purple-600 opacity-30"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-purple-600"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="text-purple-600 animate-pulse" size={size === "small" ? 20 : size === "medium" ? 30 : 40} />
        </div>
      </div>
      <p className="mt-4 text-purple-600 font-medium animate-pulse">{text}</p>
      <div className="mt-4 w-48 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
        <div className="bg-purple-600 h-1.5 rounded-full animate-[width_1.5s_ease-in-out_infinite_alternate]" style={{width: '70%'}}></div>
      </div>
    </div>
  );
};

export { AdvancedLoader };
