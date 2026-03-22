const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  path.join(__dirname, 'src/pages'),
  path.join(__dirname, 'src/components')
];

const REPLACEMENTS = [
  // Core Backgrounds
  { search: /bg-\[#050505\]/g, replace: 'bg-[#F8FAFC]' },
  { search: /bg-\[#111111\]\/80/g, replace: 'bg-[#FFFFFF] shadow-sm' },
  { search: /bg-\[#111111\]/g, replace: 'bg-[#FFFFFF]' },
  { search: /bg-black\/40/g, replace: 'bg-[#F8FAFC] border border-[#E2E8F0]' },
  { search: /bg-black\/50/g, replace: 'bg-[#FFFFFF] shadow-sm' },
  { search: /bg-black\/20/g, replace: 'bg-[#F8FAFC] border border-[#E2E8F0]' },
  { search: /bg-white\/5/g, replace: 'bg-[#F8FAFC]' },
  { search: /bg-white\/10/g, replace: 'bg-[#E2E8F0]' },

  // Backgrounds with Colors
  { search: /bg-purple-900\/30/g, replace: 'bg-[#0F766E]/10' },
  { search: /bg-purple-900\/20/g, replace: 'bg-[#0F766E]/5' },
  { search: /bg-purple-600/g, replace: 'bg-[#0F766E]' },
  { search: /bg-purple-500/g, replace: 'bg-[#14B8A6]' },

  { search: /bg-pink-900\/20/g, replace: 'bg-[#F97316]/10' },
  { search: /bg-emerald-900\/20/g, replace: 'bg-[#14B8A6]/10' },
  { search: /bg-blue-900\/20/g, replace: 'bg-[#0F766E]/10' },
  
  // Gradients
  { search: /from-purple-900\/20/g, replace: 'from-[#0F766E]/5' },
  { search: /to-purple-900\/20/g, replace: 'to-[#F8FAFC]' },
  { search: /from-purple-[3-6]00/g, replace: 'from-[#0F766E]' },
  { search: /to-pink-[3-6]00/g, replace: 'to-[#14B8A6]' },
  { search: /from-pink-[3-6]00/g, replace: 'from-[#F97316]' },
  { search: /to-red-[3-6]00/g, replace: 'to-[#F97316]' },
  { search: /via-pink-[3-6]00/g, replace: 'via-[#14B8A6]' },

  // Shadows
  { search: /shadow-\[.*?\]/g, replace: 'shadow-md' },

  // Borders
  { search: /border-white\/10/g, replace: 'border-[#E2E8F0]' },
  { search: /border-white\/5/g, replace: 'border-[#E2E8F0]' },
  { search: /border-purple-500\/30/g, replace: 'border-[#14B8A6]/30' },
  { search: /border-purple-500\/50/g, replace: 'border-[#14B8A6]/50' },
  { search: /border-pink-500\/50/g, replace: 'border-[#F97316]/50' },
  
  // Hover effects
  { search: /hover:bg-white\/10/g, replace: 'hover:bg-[#E2E8F0]' },
  { search: /hover:bg-white\/\[0\.03\]/g, replace: 'hover:bg-[#F8FAFC]' },
  { search: /hover:border-purple-500/g, replace: 'hover:border-[#0F766E]' },
  { search: /focus:border-purple-500/g, replace: 'focus:border-[#0F766E]' },

  // Text Colors (Grays)
  { search: /text-gray-300/g, replace: 'text-gray-600' },
  { search: /text-gray-400/g, replace: 'text-gray-500' },
  { search: /text-gray-500/g, replace: 'text-gray-500' },

  // Accent Text
  { search: /text-purple-400/g, replace: 'text-[#0F766E]' },
  { search: /text-purple-600/g, replace: 'text-[#0F766E]' },
  { search: /text-pink-300/g, replace: 'text-[#F97316]' },
  { search: /text-pink-400/g, replace: 'text-[#F97316]' },
  { search: /text-pink-500/g, replace: 'text-[#F97316]' },
  { search: /text-blue-400/g, replace: 'text-[#14B8A6]' },

  // Finally swap pure white text out for slate 900 IF it's not a button
  // For safety, let's swap text-white to text-slate-800, but preserve text-white conditionally on backgrounds
  { search: /text-white/g, replace: 'text-slate-800' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  REPLACEMENTS.forEach(rule => {
    content = content.replace(rule.search, rule.replace);
  });

  // Post-fix pass for buttons/gradients to ensure contrast!
  content = content.replace(/from-\[#0F766E\] to-\[#14B8A6\] text-slate-800/g, 'from-[#0F766E] to-[#14B8A6] text-white');
  content = content.replace(/bg-\[#0F766E\] text-slate-800/g, 'bg-[#0F766E] text-white');
  content = content.replace(/bg-\[#0F766E\] hover:bg-\[#14B8A6\] text-slate-800/g, 'bg-[#0F766E] hover:bg-[#14B8A6] text-white');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

TARGET_DIRS.forEach(traverse);
console.log('Complete!');
