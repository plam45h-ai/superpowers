import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, BookOpen, Layers, Terminal, Sparkles, FolderDot } from 'lucide-react';
import { Skill } from '../types';
import MarkdownViewer from './MarkdownViewer';

interface SkillsExplorerProps {
  skills: Skill[];
  selectedSkillId: string | null;
  onSelectSkillId: (id: string | null) => void;
}

export default function SkillsExplorer({ skills, selectedSkillId, onSelectSkillId }: SkillsExplorerProps) {
  const [search, setSearch] = useState('');

  // Auto-select first skill if none selected
  const activeId = selectedSkillId || (skills.length > 0 ? skills[0].id : null);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const q = search.toLowerCase();
      return (
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.id.toLowerCase().includes(q)
      );
    });
  }, [skills, search]);

  const activeSkill = useMemo(() => {
    return skills.find((s) => s.id === activeId) || null;
  }, [skills, activeId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[calc(100vh-12rem)] min-h-[500px]">
      {/* Sidebar List (4 cols) */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-sm flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-stone-100 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search skills (e.g. debugging, sdd)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* List of Skills */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
          {filteredSkills.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-sm italic">
              No matching skills found.
            </div>
          ) : (
            filteredSkills.map((skill) => {
              const isActive = skill.id === activeId;
              return (
                <button
                  key={skill.id}
                  onClick={() => onSelectSkillId(skill.id)}
                  className={`w-full text-left p-4 hover:bg-stone-50 transition-colors flex items-start justify-between gap-3 group relative cursor-pointer ${
                    isActive ? 'bg-amber-50/30 hover:bg-amber-50/40' : ''
                  }`}
                >
                  {/* Left Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                  )}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        skill.category === 'core' ? 'bg-amber-100 text-amber-800' :
                        skill.category === 'advanced' ? 'bg-purple-100 text-purple-800' :
                        'bg-stone-100 text-stone-800'
                      }`}>
                        {skill.category}
                      </span>
                      <span className="text-xs font-mono text-stone-400">{skill.id}</span>
                    </div>
                    <h4 className={`font-semibold text-sm ${isActive ? 'text-stone-900 font-bold' : 'text-stone-700'} group-hover:text-stone-900`}>
                      {skill.name}
                    </h4>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-1 transition-transform flex-shrink-0 ${
                    isActive ? 'text-amber-500 translate-x-0.5' : 'text-stone-300 group-hover:text-stone-400'
                  }`} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Detail Viewer (8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-sm flex flex-col">
        {activeSkill ? (
          <>
            {/* Detail Header */}
            <div className="px-6 py-5 border-b border-stone-100 bg-stone-50/40 flex items-center justify-between flex-shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    activeSkill.category === 'core' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    activeSkill.category === 'advanced' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                    'bg-stone-100 text-stone-800 border border-stone-200'
                  }`}>
                    {activeSkill.category === 'core' ? <Sparkles className="w-3 h-3" /> :
                     activeSkill.category === 'advanced' ? <Layers className="w-3 h-3" /> :
                     <Terminal className="w-3 h-3" />}
                    {activeSkill.category.toUpperCase()} SKILL
                  </span>
                  <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60">
                    {activeSkill.filePath}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 font-display">
                  {activeSkill.name}
                </h2>
              </div>
            </div>

            {/* Markdown Body Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
              <MarkdownViewer content={activeSkill.content} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400">
            <BookOpen className="w-12 h-12 mb-3 text-stone-300" />
            <p className="font-medium text-stone-500">No skill selected</p>
            <p className="text-xs text-stone-400 mt-1">Choose a skill from the list to explore its instructions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
