import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette, Type, Image, Save, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  companyName: string;
  logoUrl: string;
  tagline: string;
}

const DEFAULT_BRANDING: BrandingSettings = {
  primaryColor: "#1F4E79",
  secondaryColor: "#2B579A",
  accentColor: "#0D47A1",
  fontFamily: "Calibri",
  companyName: "",
  logoUrl: "",
  tagline: ""
};

const FONT_OPTIONS = [
  { value: "Calibri", label: "Calibri (Moderne)" },
  { value: "Arial", label: "Arial (Sans-serif)" },
  { value: "Times New Roman", label: "Times New Roman (Classique)" },
  { value: "Georgia", label: "Georgia (Élégant)" },
  { value: "Verdana", label: "Verdana (Lisible)" },
  { value: "Garamond", label: "Garamond (Raffiné)" },
];

interface BrandingSettingsPanelProps {
  onBrandingChange?: (branding: BrandingSettings) => void;
  onClose?: () => void;
  compact?: boolean;
}

export function BrandingSettingsPanel({ onBrandingChange, onClose, compact = false }: BrandingSettingsPanelProps) {
  const [branding, setBranding] = useState<BrandingSettings>(() => {
    const saved = localStorage.getItem('aether_doc_branding');
    return saved ? JSON.parse(saved) : DEFAULT_BRANDING;
  });

  useEffect(() => {
    onBrandingChange?.(branding);
  }, [branding, onBrandingChange]);

  const handleChange = (field: keyof BrandingSettings, value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('aether_doc_branding', JSON.stringify(branding));
    toast.success("Charte graphique enregistrée");
  };

  const handleReset = () => {
    setBranding(DEFAULT_BRANDING);
    localStorage.removeItem('aether_doc_branding');
    toast.success("Charte graphique réinitialisée");
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">Couleur principale</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <Input
                value={branding.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Couleur secondaire</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={branding.secondaryColor}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <Input
                value={branding.secondaryColor}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Couleur accent</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={branding.accentColor}
                onChange={(e) => handleChange('accentColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <Input
                value={branding.accentColor}
                onChange={(e) => handleChange('accentColor', e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Police</Label>
            <select
              value={branding.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full h-8 rounded-md border bg-background px-2 text-xs mt-1"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.value} value={font.value}>{font.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs">Nom de l'entreprise</Label>
            <Input
              value={branding.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="Ma Société"
              className="h-8 text-xs mt-1"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          Charte Graphique
        </h4>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Réinitialiser
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-3.5 h-3.5 mr-1" />
            Enregistrer
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="ml-2">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: branding.primaryColor }} />
            Couleur principale
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={branding.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <Input
              value={branding.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: branding.secondaryColor }} />
            Couleur secondaire
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={branding.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <Input
              value={branding.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: branding.accentColor }} />
            Couleur accent
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={branding.accentColor}
              onChange={(e) => handleChange('accentColor', e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <Input
              value={branding.accentColor}
              onChange={(e) => handleChange('accentColor', e.target.value)}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1.5">
            <Type className="w-3 h-3" />
            Police de caractères
          </Label>
          <select
            value={branding.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full h-9 rounded-md border bg-background px-3 text-sm"
          >
            {FONT_OPTIONS.map(font => (
              <option key={font.value} value={font.value}>{font.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1.5">
            <Image className="w-3 h-3" />
            Nom de l'entreprise
          </Label>
          <Input
            value={branding.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="Ma Société SAS"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Slogan / Tagline (optionnel)</Label>
        <Input
          value={branding.tagline}
          onChange={(e) => handleChange('tagline', e.target.value)}
          placeholder="Innovation & Excellence"
        />
      </div>

      {/* Preview */}
      <div className="border rounded-lg p-4 bg-white">
        <p className="text-xs text-muted-foreground mb-2">Aperçu</p>
        <div 
          className="border-l-4 pl-3"
          style={{ borderColor: branding.primaryColor }}
        >
          <h5 
            className="font-semibold"
            style={{ 
              color: branding.primaryColor,
              fontFamily: branding.fontFamily
            }}
          >
            {branding.companyName || "Titre du Document"}
          </h5>
          <p 
            className="text-sm mt-1"
            style={{ 
              color: branding.secondaryColor,
              fontFamily: branding.fontFamily 
            }}
          >
            {branding.tagline || "Sous-titre ou description"}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function getBrandingSettings(): BrandingSettings {
  const saved = localStorage.getItem('aether_doc_branding');
  return saved ? JSON.parse(saved) : DEFAULT_BRANDING;
}
