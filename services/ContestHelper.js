
export function calculateTierStats(tierId, results) {
  if (!results) return { rankedMembers: [], totalWeighted: 0 };

  // 1. Filtere Ergebnisse nur für dieses Tier
  const tierResults = results.filter(r => r.tier_id === tierId);

  // 2. Gruppiere nach Mitglied
  const memberMap = tierResults.reduce((acc, curr) => {
    const mId = curr.member_id;

    if (!acc[mId]) {
      acc[mId] = {
        name: curr.mitglied?.upjersname || curr.mitglied?.name || `Mitglied #${mId}`,
        rawSum: 0
      };
    }

    acc[mId].rawSum += (curr.level * curr.anzahl);
    return acc;
  }, {});

  // 3. Sortieren und Multiplikator anwenden
  const sorted = Object.values(memberMap).sort((a, b) => b.rawSum - a.rawSum);

  let totalWeighted = 0;
  const rankedMembers = sorted.map((m, index) => {
    const multiplier = 10 * Math.max(1, 4 - index);
    const weighted = m.rawSum * multiplier;
    totalWeighted += weighted;

    return { ...m, multiplier, weighted };
  });

  return { rankedMembers, totalWeighted };
}