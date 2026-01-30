// ==========================================
// Sticky Note Component - N8N Style Annotations
// ==========================================

import { memo, useState } from 'react';
import { StickyNote as StickyNoteType } from '@/types/workflow-v2';
import { cn } from '@/lib/utils';
import { X, GripVertical } from 'lucide-react';

type ZoomLevel = 'micro' | 'mini' | 'normal' | 'detailed';

interface StickyNoteProps {
  note: StickyNoteType;
  isSelected: boolean;
  zoomLevel: ZoomLevel;
  onSelect: () => void;
  onUpdate: (updates: Partial<StickyNoteType>) => void;
  onDelete: () => void;
}

// Pastel colors for sticky notes
const noteColors: Record<string, { bg: string; border: string; text: string }> = {
  yellow: { bg: '#fef9c3', border: '#fde047', text: '#854d0e' },
  green: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  blue: { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
  pink: { bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d' },
  purple: { bg: '#f3e8ff', border: '#d8b4fe', text: '#6b21a8' },
};

function StickyNoteComponent({
  note,
  isSelected,
  zoomLevel,
  onSelect,
  onUpdate,
  onDelete,
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.content);

  const colors = noteColors[note.color] || noteColors.green;

  const handleDoubleClick = () => {
    if (zoomLevel !== 'micro') {
      setIsEditing(true);
      setEditText(note.content);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editText !== note.content) {
      onUpdate({ content: editText });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(note.content);
    }
  };

  // Micro view: just a small colored indicator
  if (zoomLevel === 'micro') {
    return (
      <rect
        x={note.position.x}
        y={note.position.y}
        width={20}
        height={20}
        rx={4}
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth={1}
        className="cursor-pointer"
        onClick={onSelect}
      />
    );
  }

  return (
    <foreignObject
      x={note.position.x}
      y={note.position.y}
      width={note.width || 200}
      height={note.height || 100}
      className="overflow-visible"
    >
      <div
        className={cn(
          "w-full h-full rounded-lg shadow-sm cursor-pointer transition-all duration-150",
          "border-2",
          isSelected && "ring-2 ring-primary ring-offset-2"
        )}
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
        }}
        onClick={onSelect}
        onDoubleClick={handleDoubleClick}
      >
        {/* Header with drag handle and delete */}
        <div className="flex items-center justify-between px-2 py-1 border-b" style={{ borderColor: colors.border }}>
          <GripVertical className="w-3 h-3 opacity-40 cursor-move" style={{ color: colors.text }} />
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-0.5 rounded hover:bg-black/10 transition-colors"
            >
              <X className="w-3 h-3" style={{ color: colors.text }} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-2 h-[calc(100%-28px)]">
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full h-full bg-transparent resize-none outline-none text-sm"
              style={{ color: colors.text }}
            />
          ) : (
            <p 
              className={cn(
                "text-sm leading-relaxed",
                zoomLevel === 'mini' && "line-clamp-2",
                zoomLevel === 'normal' && "line-clamp-4"
              )}
              style={{ color: colors.text }}
            >
              {note.content}
            </p>
          )}
        </div>
      </div>
    </foreignObject>
  );
}

export { StickyNoteComponent };
