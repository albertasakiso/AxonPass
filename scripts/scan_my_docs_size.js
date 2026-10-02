import fs from 'fs';
import path from 'path';

const docsDir = 'd:/SECTOR FUSION PROJECTS/apiliguPass/my_documents';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else {
      results.push({
        path: filePath,
        relPath: path.relative(docsDir, filePath).replace(/\\/g, '/'),
        size: stat.size,
        ext: path.extname(file).toLowerCase()
      });
    }
  }
  return results;
}

const files = getFiles(docsDir);
console.log('Total files:', files.length);
const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
console.log('Total size:', (totalBytes / (1024 * 1024)).toFixed(2), 'MB');

const largeFiles = files.filter(f => f.size > 50 * 1024 * 1024);
console.log('\nFiles > 50MB (' + largeFiles.length + '):');
for (const f of largeFiles) {
  console.log(`- ${f.relPath} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`);
}
