// components/CustomerDetailedView.tsx
import { Profile, MatchStatus } from '@/types';
import Image from 'next/image';
import { Briefcase, GraduationCap, MapPin, Heart, Users, HouseLine } from '@phosphor-icons/react';
import MatchCard from './MatchCard';
import { calculateMatchScore } from '@/lib/matching';
import NotesPanel from './NotesPanel';

interface Props {
  profile: Profile;
  allClients: Profile[]; // Passed from dashboard instead of static JSON
  onStatusUpdate?: (clientId: string, status: MatchStatus) => void;
}

export default function CustomerDetailedView({ profile, allClients, onStatusUpdate }: Props) {
  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full">
      
      {/* LEFT COLUMN: The Client's Biodata (Bento Grid) */}
      <div className="w-full xl:w-1/2 space-y-6 overflow-y-auto pr-2 pb-20">
        
        {/* Box 1: Hero Profile */}
        <div className="flex gap-6 p-6 rounded-2xl bg-[#13141A] border border-white/5 shadow-xl">
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image 
              src={profile.photos[0]} 
              alt={profile.firstName} 
              fill
              className="rounded-xl object-cover border border-white/10"
              sizes="128px"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-1">
              {profile.firstName} {profile.lastName}
            </h2>
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
              <MapPin size={16} />
              {profile.city}, {profile.country} • {profile.age} yrs
            </div>
            <p className="text-sm text-zinc-300 italic leading-relaxed">
              "{profile.aboutMe}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Box 2: Career & Education */}
          <div className="col-span-2 sm:col-span-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <Briefcase size={16} /> Career
            </h3>
            <p className="text-white font-medium text-sm">{profile.designation}</p>
            <p className="text-zinc-400 text-sm mb-4">{profile.company}</p>
            
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 mt-4 flex items-center gap-2">
              <GraduationCap size={16} /> Education
            </h3>
            <p className="text-white font-medium text-sm">{profile.degree} in {profile.specialization}</p>
            <p className="text-zinc-400 text-sm">{profile.ugCollege}</p>
          </div>

          {/* Box 3: Background & Family */}
          <div className="col-span-2 sm:col-span-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <HouseLine size={16} /> Background
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Religion</span>
                <span className="text-white">{profile.religion}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Caste</span>
                <span className="text-white">{profile.caste}</span>
              </div>
              {profile.gotra && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Gotra</span>
                  <span className="text-white">{profile.gotra}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Family Type</span>
                <span className="text-white">{profile.familyType}</span>
              </div>
            </div>
          </div>

          {/* Box 4: Lifestyle Tags */}
          <div className="col-span-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Lifestyle & Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                {profile.dietaryPreference}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {profile.drinking === 'No' ? 'No Drinking' : profile.drinking + ' Drinking'}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {profile.wantKids === 'Yes' ? 'Wants Kids' : 'No Kids'}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {profile.openToRelocate === 'Yes' ? 'Open to Relocate' : 'Won\'t Relocate'}
              </span>
            </div>
          </div>
          <NotesPanel clientId={profile.id}/>
        </div>
      </div>

      {/* RIGHT COLUMN: The Matching Algorithm */}
      <div className="w-full xl:w-1/2 p-6 rounded-2xl bg-[#0C0D12] border border-white/5 shadow-inner overflow-y-auto">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <Heart size={24} weight="duotone" className="text-rose-500" />
          <h2 className="text-xl font-bold text-white">Algorithm Matches</h2>
        </div>
        
        <div className="space-y-4">
          {allClients
            .filter(p => p.id !== profile.id)
            .map(candidate => ({
              profile: candidate,
              score: calculateMatchScore(profile, candidate)
            }))
            .sort((a, b) => b.score - a.score) // Sort descending
            .map(match => (
              <MatchCard 
                key={match.profile.id} 
                match={match.profile} 
                score={match.score} 
                client={profile}
                onStatusUpdate={onStatusUpdate}
              />
            ))}

          {allClients.length <= 1 && (
             <p className="text-zinc-500 text-sm text-center mt-10">
               Add more profiles to the database to see the algorithm in action!
             </p>
          )}
        </div>
      </div>
      
    </div>
  );
}