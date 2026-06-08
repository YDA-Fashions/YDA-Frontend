const fs = require('fs');
const path = require('path');

// Resolve the project's src directory correctly
const root = path.resolve(__dirname, '..', 'src');

function getAllTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllTsxFiles(filePath));
    } else if (filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

function hasButtonImport(content) {
  return /import\s+\{\s*Button\s*\}\s+from\s+['"]@\/components\/ui\/Button['"]/.test(content);
}

function insertButtonImport(content) {
  const lines = content.split('\n');
  // Find the last import statement
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) {
      lastImportIdx = i;
    }
  }
  const importLine = "import { Button } from '@/components/ui/Button';";
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, importLine);
  } else {
    lines.unshift(importLine);
  }
  return lines.join('\n');
}

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  // Replace opening <button ...> tags with <Button ...>
  content = content.replace(/<button(\s[^>]*)>/gi, '<Button$1>');
  // Replace closing </button> tags with </Button>
  content = content.replace(/<\/button>/gi, '</Button>');
  if (content !== original) {
    if (!hasButtonImport(content)) {
      content = insertButtonImport(content);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

const files = getAllTsxFiles(root);
files.forEach(replaceInFile);
console.log('Button replacement complete.');
