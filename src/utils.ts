import { Skill } from './types';

// Simple frontmatter parser matching the host logic
export function parseFrontmatter(rawContent: string): { frontmatter: Record<string, string>; body: string } {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: rawContent };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter: Record<string, string> = {};
  let lastKey: string | null = null;

  for (const rawLine of frontmatterStr.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && !/^\s/.test(line)) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      frontmatter[key] = /^(>[+-]?|\|[+-]?)$/.test(value) ? '' : value;
      lastKey = key;
    } else if (lastKey !== null && line.trim() !== '') {
      frontmatter[lastKey] = `${frontmatter[lastKey]} ${line.trim()}`.trim();
    }
  }

  for (const key of Object.keys(frontmatter)) {
    frontmatter[key] = frontmatter[key].replace(/^(["'])([\s\S]*)\1$/, '$2');
  }

  return { frontmatter, body };
}

export function getSkills(): Skill[] {
  // Use Vite's native static asset globs to read all SKILL.md files in real-time
  const skillModules = import.meta.glob('/skills/**/SKILL.md', { query: '?raw', eager: true }) as Record<string, { default: string }>;
  const skills: Skill[] = [];

  for (const [filePath, module] of Object.entries(skillModules)) {
    const rawContent = module.default;
    const { frontmatter, body } = parseFrontmatter(rawContent);
    
    // Extract ID from file path: e.g. "/skills/brainstorming/SKILL.md" -> "brainstorming"
    const pathParts = filePath.split('/');
    const id = pathParts[pathParts.length - 2] || 'unknown';
    
    // Categorize based on keywords or path names
    let category: 'core' | 'development' | 'advanced' = 'development';
    if (['using-superpowers', 'writing-plans', 'executing-plans'].includes(id)) {
      category = 'core';
    } else if (['subagent-driven-development', 'dispatching-parallel-agents', 'using-git-worktrees'].includes(id)) {
      category = 'advanced';
    }

    skills.push({
      id,
      name: frontmatter.name || formatId(id),
      description: frontmatter.description || 'No description available.',
      category,
      content: body.trim(),
      filePath,
    });
  }

  // Sort: core first, then others alphabetically
  return skills.sort((a, b) => {
    if (a.category === 'core' && b.category !== 'core') return -1;
    if (a.category !== 'core' && b.category === 'core') return 1;
    return a.name.localeCompare(b.name);
  });
}

function formatId(id: string): string {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
