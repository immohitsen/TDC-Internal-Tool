import { Profile } from '@/types';

export function calculateMatchScore(client: Profile, candidate: Profile): number {
  let score = 0;

  // Rule 1: Heterosexual matching for this MVP
  if (client.gender === candidate.gender) return 0;

  if (client.gender === 'Male') {
    // Logic for Male Clients (as per PDF requirements)
    
    // 1. Younger (Max 30 points)
    if (candidate.age < client.age) {
      const ageDiff = client.age - candidate.age;
      score += ageDiff <= 5 ? 30 : 15; // Perfect if 1-5 years younger
    }
    
    // 2. Shorter (Max 20 points)
    if (candidate.heightCm < client.heightCm) score += 20;

    // 3. Earns Less (Max 20 points)
    if (candidate.annualIncomeINR < client.annualIncomeINR) score += 20;

    // 4. View on Children (Max 30 points)
    if (client.wantKids === candidate.wantKids) score += 30;

  } else {
    // Logic for Female Clients (Compatibility & Values)
    
    // 1. Age: Prefer older or same age (Max 20 points)
    if (candidate.age >= client.age && candidate.age <= client.age + 5) score += 20;

    // 2. Profession/Income Compatibility (Max 30 points)
    if (candidate.annualIncomeINR >= client.annualIncomeINR) score += 30;

    // 3. Relocation Alignment (Max 25 points)
    if (client.openToRelocate === candidate.openToRelocate || candidate.openToRelocate === 'Yes') score += 25;

    // 4. Lifestyle & Diet (Max 25 points)
    if (client.dietaryPreference === candidate.dietaryPreference) score += 25;
  }

  return score;
}

// Helper to determine the badge color based on score
export function getScoreLabel(score: number) {
  if (score >= 85) return { label: 'High Potential', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' };
  if (score >= 70) return { label: 'Good Match', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' };
  if (score >= 55) return { label: 'Compatible', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' };
  return { label: 'Partial Match', color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' };
}