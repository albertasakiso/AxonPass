import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push({ path: path.relative('my_documents', fullPath), size: stat.size, ext: path.extname(file).toLowerCase() });
    }
  });
  return results;
}

const allFiles = walk('my_documents');
console.log('Total files in my_documents:', allFiles.length);

const grouped = {};
allFiles.forEach(f => {
  const rootDir = f.path.includes(path.sep) ? f.path.split(path.sep)[0] : 'root';
  if (!grouped[rootDir]) grouped[rootDir] = [];
  grouped[rootDir].push(f);
});

for (const [group, files] of Object.entries(grouped)) {
  console.log(`\n=== GROUP: ${group} (${files.length} files) ===`);
  files.sort((a, b) => b.size - a.size).forEach(f => {
    console.log(`  ${(f.size / (1024 * 1024)).toFixed(2).padStart(6, ' ')} MB | ${f.path}`);
  });
}
