const fs = require('fs');
const path = require('path');

const mapPath = path.join(__dirname, 'cloudinary_map.json');
if (!fs.existsSync(mapPath)) {
  console.error('cloudinary_map.json not found!');
  process.exit(1);
}
const urlMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));

const APPS_DIR = path.join(__dirname, 'apps');

const getFiles = (dir, ext, fileList = []) => {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // ignore node_modules and .next
      if (file !== 'node_modules' && file !== '.next') {
        getFiles(filePath, ext, fileList);
      }
    } else {
      if (filePath.endsWith(ext) || filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.json')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
};

const srcFiles = getFiles(APPS_DIR, '.tsx');

let changedFiles = 0;
for (const file of srcFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  let hasChanges = false;
  for (const [relPath, cloudUrl] of Object.entries(urlMap)) {
    // Replace all occurrences of the relative path
    const searchStr = relPath; 
    if (content.includes(searchStr)) {
      content = content.split(searchStr).join(cloudUrl);
      hasChanges = true;
    }
    
    // Also try without leading slash just in case
    const noSlash = relPath.substring(1);
    if (content.includes(`"${noSlash}"`) || content.includes(`'${noSlash}'`) || content.includes(`/${noSlash}`)) {
       content = content.split(`"${noSlash}"`).join(`"${cloudUrl}"`);
       content = content.split(`'${noSlash}'`).join(`'${cloudUrl}'`);
       hasChanges = true;
    }
  }
  
  if (hasChanges) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated URLs in: ${file}`);
    changedFiles++;
  }
}

console.log(`Done. Updated ${changedFiles} files.`);
