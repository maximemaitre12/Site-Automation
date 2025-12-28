import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand={false}
      richColors={false}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "w-full max-w-md flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/95 backdrop-blur-lg shadow-xl shadow-black/5 animate-cloud-fade-in",
          title: "text-sm font-medium text-foreground",
          description: "text-xs text-muted-foreground mt-0.5",
          actionButton: "ml-auto px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
          cancelButton: "px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors",
          success: "border-success/30 bg-success/5",
          error: "border-destructive/30 bg-destructive/5",
          warning: "border-warning/30 bg-warning/5",
          info: "border-primary/30 bg-primary/5",
        },
      }}
      icons={{
        success: <CheckCircle className="w-5 h-5 text-success shrink-0" />,
        error: <XCircle className="w-5 h-5 text-destructive shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
        info: <Info className="w-5 h-5 text-primary shrink-0" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
