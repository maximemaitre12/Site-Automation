import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Check, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeVariant?: 'default' | 'secondary' | 'destructive';
}

export interface NavGroup {
  label: string;
  sections: NavSection[];
}

interface MobileAgentNavProps {
  groups: NavGroup[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  accentColor?: string;
  className?: string;
}

export function MobileAgentNav({ 
  groups, 
  activeSection, 
  onSectionChange,
  accentColor = 'bg-primary',
  className 
}: MobileAgentNavProps) {
  const [open, setOpen] = useState(false);

  // Find active section info
  const allSections = groups.flatMap(g => g.sections);
  const activeSectionInfo = allSections.find(s => s.id === activeSection);
  const ActiveIcon = activeSectionInfo?.icon;

  return (
    <div className={cn("md:hidden", className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-11 px-4 bg-background border-border"
          >
            <div className="flex items-center gap-3">
              {ActiveIcon && (
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", accentColor)}>
                  <ActiveIcon className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="font-medium">{activeSectionInfo?.label || 'Sélectionner'}</span>
              {activeSectionInfo?.badge !== undefined && (
                <Badge 
                  variant={activeSectionInfo.badgeVariant || "secondary"} 
                  className="text-xs h-5 px-1.5"
                >
                  {activeSectionInfo.badge}
                </Badge>
              )}
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              open && "rotate-180"
            )} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-[calc(100vw-2rem)] max-w-sm bg-popover border-border z-50" 
          align="start"
          sideOffset={8}
        >
          {groups.map((group, groupIndex) => (
            <div key={group.label}>
              {groupIndex > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                {group.label}
              </DropdownMenuLabel>
              {group.sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <DropdownMenuItem
                    key={section.id}
                    className={cn(
                      "flex items-center gap-3 py-3 px-3 cursor-pointer",
                      isActive && "bg-muted"
                    )}
                    onSelect={() => {
                      onSectionChange(section.id);
                      setOpen(false);
                    }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isActive ? accentColor : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "w-4 h-4",
                        isActive ? "text-white" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        "font-medium text-sm",
                        isActive && "text-foreground"
                      )}>
                        {section.label}
                      </span>
                    </div>
                    {section.badge !== undefined && (
                      <Badge 
                        variant={section.badgeVariant || "secondary"} 
                        className="text-xs h-5 px-1.5 ml-auto"
                      >
                        {section.badge}
                      </Badge>
                    )}
                    {isActive && (
                      <Check className="w-4 h-4 text-primary ml-1" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
