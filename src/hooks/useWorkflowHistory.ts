import { useState, useCallback } from 'react';
import { WorkflowBlock, BlockConnection } from '@/types/workflow';

interface WorkflowState {
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
}

interface HistoryEntry {
  state: WorkflowState;
  label: string;
}

export function useWorkflowHistory(initialBlocks: WorkflowBlock[], initialConnections: BlockConnection[]) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { state: { blocks: initialBlocks, connections: initialConnections }, label: 'Initial' }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex]?.state || { blocks: [], connections: [] };

  const pushState = useCallback((blocks: WorkflowBlock[], connections: BlockConnection[], label: string) => {
    setHistory(prev => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      // Add new state
      newHistory.push({ state: { blocks: [...blocks], connections: [...connections] }, label });
      // Keep only last 50 states to prevent memory issues
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, 49));
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1]?.state;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1]?.state;
    }
    return null;
  }, [currentIndex, history]);

  const reset = useCallback((blocks: WorkflowBlock[], connections: BlockConnection[]) => {
    setHistory([{ state: { blocks, connections }, label: 'Initial' }]);
    setCurrentIndex(0);
  }, []);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    currentState,
    pushState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historyLength: history.length,
    currentIndex
  };
}
