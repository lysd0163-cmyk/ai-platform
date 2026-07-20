function normalizeLine(line) {
  return String(line || '')
    .trim()
    .replace(/^[-*]\s*/, '')
    .replace(/^\d+[.)]\s*/, '');
}

function parseSectionTitle(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed) {
    return null;
  }

  const headingMatch = trimmed.match(/^#{1,6}\s+(.+)$/);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  return null;
}

function parseStrategy(rawStrategy) {
  if (rawStrategy && typeof rawStrategy === 'object' && !Array.isArray(rawStrategy)) {
    const sections = Array.isArray(rawStrategy.sections) ? rawStrategy.sections : [];
    const rules = Array.isArray(rawStrategy.rules) ? rawStrategy.rules : [];
    const directives = Array.isArray(rawStrategy.directives) ? rawStrategy.directives : [];

    return {
      strategyName: rawStrategy.strategyName || rawStrategy.name || 'Unnamed Strategy',
      version: rawStrategy.version || rawStrategy.strategyVersion || 'unknown',
      rawText: rawStrategy.rawText || JSON.stringify(rawStrategy, null, 2),
      sections,
      rules: rules.map((rule, index) => ({
        id: rule.id || `rule-${index + 1}`,
        text: normalizeLine(rule.text || rule.value || ''),
        tags: Array.isArray(rule.tags) ? rule.tags : [],
        enabled: rule.enabled !== false,
        weight: Number.isFinite(rule.weight) ? rule.weight : 1,
      })),
      directives,
      status: 'parsed',
    };
  }

  const text = String(rawStrategy ?? '').trim();
  const lines = text.split(/\r?\n/);
  const sections = [];
  const rules = [];
  const directives = [];
  let currentSection = { title: 'Preamble', lines: [] };
  let strategyName = 'Unnamed Strategy';
  let version = 'unknown';

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const sectionTitle = parseSectionTitle(line);
    if (sectionTitle) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { title: sectionTitle, lines: [] };
      if (/strategy/i.test(sectionTitle) && strategyName === 'Unnamed Strategy') {
        strategyName = sectionTitle;
      }
      const versionMatch = sectionTitle.match(/v(\d+(?:\.\d+)*)/i);
      if (versionMatch) {
        version = versionMatch[1];
      }
      continue;
    }

    currentSection.lines.push(line);

    const normalized = normalizeLine(line);
    if (/^version\s*[:=]/i.test(normalized)) {
      version = normalized.split(/[:=]/).slice(1).join(':').trim() || version;
    } else if (/^strategy\s*[:=]/i.test(normalized)) {
      strategyName = normalized.split(/[:=]/).slice(1).join(':').trim() || strategyName;
    } else if (/^(rule|condition|law|requirement)\s*[:=]/i.test(normalized)) {
      rules.push({
        id: `rule-${rules.length + 1}`,
        text: normalized.split(/[:=]/).slice(1).join(':').trim(),
        tags: [],
        enabled: true,
        weight: 1,
      });
    } else if (/^(must|should|if|when|then|validate|confirm|require)\b/i.test(normalized)) {
      directives.push(normalized);
    }
  }

  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  if (rules.length === 0) {
    const fallbackRules = text
      .split(/\r?\n/)
      .map(normalizeLine)
      .filter(Boolean)
      .filter((line) => line.length > 8)
      .slice(0, 200);

    for (const [index, rule] of fallbackRules.entries()) {
      rules.push({
        id: `rule-${index + 1}`,
        text: rule,
        tags: [],
        enabled: true,
        weight: 1,
      });
    }
  }

  return {
    strategyName,
    version,
    rawText: text,
    sections,
    rules,
    directives,
    status: 'parsed',
  };
}

module.exports = {
  parseStrategy,
};
