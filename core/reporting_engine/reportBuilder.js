function buildReport(data = {}) {
  const zones = data.zones || {};
  const selectedZone = zones.selectedZone || null;
  const reasons = Array.isArray(data.reasons) ? data.reasons : [];

  return {
    ...data,
    decision: selectedZone
      ? {
          side: zones.selectedSide || selectedZone.side || null,
          zone: selectedZone,
        }
      : null,
    summary: {
      pair: data.pair || null,
      timeframes: data.timeframes || [],
      status: data.status || 'unknown',
      score: data.score?.score ?? null,
      intersectionValid: data.intersection?.valid ?? false,
      totalReasons: reasons.length,
    },
    reasons,
    builtAt: new Date().toISOString(),
    status: reasons.length > 0 ? 'review' : 'ready',
  };
}

module.exports = {
  buildReport,
};
