// components/NotesPanel.tsx
import { useState, useEffect } from 'react';
import { Notepad, CheckCircle, Spinner } from '@phosphor-icons/react';

interface Props {
  clientId: string;
}

export default function NotesPanel({ clientId }: Props) {
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/notes?clientId=${clientId}`);
        if (res.ok) {
          const data = await res.json();
          setNote(data.content || '');
        }
      } catch (error) {
        console.error('Failed to load note:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (clientId) fetchNote();
  }, [clientId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, content: note })
      });
      
      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="col-span-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <Notepad size={16} /> Matchmaker Notes
        </h3>
        <div className="flex items-center gap-2">
          {isLoading && <Spinner size={14} className="text-zinc-500 animate-spin" />}
          {isSaved && (
            <span className="text-emerald-400 text-xs flex items-center gap-1 animate-pulse">
              <CheckCircle size={14} weight="fill" /> Saved
            </span>
          )}
        </div>
      </div>
      
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={isLoading || isSaving}
        placeholder="Record notes from client calls, date feedback, or specific dealbreakers..."
        className="w-full h-32 bg-[#0C0D12] border border-white/10 rounded-xl p-4 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all resize-none disabled:opacity-50"
      />
      
      <div className="flex justify-end mt-3">
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? <Spinner size={14} className="animate-spin" /> : 'Save Notes'}
        </button>
      </div>
    </div>
  );
}