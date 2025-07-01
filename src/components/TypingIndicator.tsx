
import React from 'react';
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 mb-4">
      <Avatar className="w-8 h-8">
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex items-end">
        <div className="bg-muted rounded-2xl px-4 py-2 flex items-center justify-center gap-1.5 border border-gray-100 dark:border-gray-800">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
