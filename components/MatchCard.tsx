import { useState } from 'react';
import { Profile, MatchStatus } from '@/types';
import { getScoreLabel } from '@/lib/matching';
import { PaperPlaneRight, ShareNetwork, Sparkle, CheckCircle } from '@phosphor-icons/react';

interface Props {
  match: Profile;
  score: number;
  client: Profile;
  onStatusUpdate?: (clientId: string, status: MatchStatus) => void;
}

export default function MatchCard({ match, score, client, onStatusUpdate }: Props) {
  const [interactionStatus, setInteractionStatus] = useState<'New' | 'Draft' | 'Intro Sent'>('New');
  const [isGenerating, setIsGenerating] = useState(false);

  // New state to hold the generated email text
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);

  const { label, color } = getScoreLabel(score);

  const handleAIIntro = async () => {
    setIsGenerating(true);

    try {
      // Hitting our secure Next.js API route
      const response = await fetch('/api/ai-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client, match }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedEmail(data.emailText);
        setInteractionStatus('Draft');
      } else {
        console.error(data.error);
        alert("Failed to generate intro. Check console for details.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
      <div className="flex gap-4">
        <img
          src={match.photos[0]}
          alt={match.firstName}
          className="w-16 h-16 rounded-xl object-cover border border-white/10"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-white font-bold">{match.firstName} {match.lastName}, {match.age}</h4>
              <p className="text-xs text-zinc-400">{match.designation} • {match.city}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-white">{score}%</span>
            </div>
          </div>
          <div className={`mt-2 inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${color}`}>
            {label}
          </div>
        </div>
      </div>

      {/* NEW: The AI Email Display Panel */}
      {generatedEmail && (
        <div className="mt-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-100 text-sm leading-relaxed relative">
          <div className="absolute -top-2 -left-2 bg-[#0C0D12] rounded-full p-1 border border-indigo-500/30 z-10">
            <Sparkle size={16} weight="fill" className="text-indigo-400" />
          </div>
          {interactionStatus === 'Draft' ? (
            <textarea
              value={generatedEmail}
              onChange={(e) => setGeneratedEmail(e.target.value)}
              className="w-full bg-transparent border border-indigo-500/30 rounded-lg p-3 text-indigo-100 focus:outline-none focus:border-indigo-400 min-h-[200px] resize-y"
            />
          ) : (
            <p className="whitespace-pre-wrap">{generatedEmail}</p>
          )}
        </div>
      )}

      {/* Action Pipeline */}
      <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
        {interactionStatus === 'New' && (
          <button
            onClick={handleAIIntro}
            disabled={isGenerating}
            className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold py-2 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? <span className="animate-pulse">Writing AI Email...</span> : <><Sparkle size={16} weight="fill" /> Generate Match Email</>}
          </button>
        )}

        {interactionStatus === 'Draft' && (
          <>
            <button
              onClick={handleAIIntro}
              disabled={isGenerating}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? <span className="animate-pulse">Regenerating...</span> : 'Regenerate'}
            </button>
            <button
              onClick={() => {
                alert('Email sent to client successfully!');
                setInteractionStatus('Intro Sent');
                if (onStatusUpdate) {
                  onStatusUpdate(client.id, 'Active');
                  // Optional: update the match's status as well if needed in future
                }
              }}
              className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded-lg flex justify-center items-center gap-2 transition-colors cursor-pointer"
            >
              <PaperPlaneRight size={16} weight="fill" /> Send Match
            </button>
          </>
        )}

        {interactionStatus === 'Intro Sent' && (
          <div className="flex-1 flex justify-center items-center gap-2 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <CheckCircle size={16} weight="fill" /> Match Sent Successfully
          </div>
        )}
      </div>
    </div>
  );
}