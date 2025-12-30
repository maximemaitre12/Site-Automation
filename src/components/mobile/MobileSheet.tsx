import { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function MobileSheet({ 
  open, 
  onOpenChange, 
  title, 
  children,
  className 
}: MobileSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className={cn(
          "h-[85vh] rounded-t-2xl px-0 pt-2",
          className
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        
        {title && (
          <SheetHeader className="px-4 pb-3 border-b border-border">
            <SheetTitle className="text-left">{title}</SheetTitle>
          </SheetHeader>
        )}
        
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
