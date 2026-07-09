const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cloudinary = require('cloudinary').v2;

require('dotenv').config({ path: '.env.local' });

// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

const SIZE_LIMIT = 1 * 1024 * 1024; // 1 MB
const APPS_DIR = path.join(__dirname, 'apps');

const getLargeFiles = (dir, fileList = []) => {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getLargeFiles(filePath, fileList);
    } else {
      if (stat.size > SIZE_LIMIT) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
};

const main = async () => {
  console.log('Finding heavy files > 1MB...');
  const allHeavyFiles = getLargeFiles(APPS_DIR).filter(f => {
    // Only upload media files
    return /\.(png|jpe?g|svg|mp4|gif)$/i.test(f);
  });

  // Deduplicate files by relative path (e.g. /images/Banner/Hero-1.svg)
  // Since they are duplicated across apps, we only need to upload one instance
  // per relative path and replace it globally.
  const filesToUpload = new Map();
  for (const file of allHeavyFiles) {
    const parts = file.split(path.sep);
    const publicIndex = parts.indexOf('public');
    if (publicIndex !== -1) {
      const relativePath = '/' + parts.slice(publicIndex + 1).join('/');
      if (!filesToUpload.has(relativePath)) {
        filesToUpload.set(relativePath, file);
      }
    }
  }

  console.log(`Found ${filesToUpload.size} unique heavy files to upload.`);

  const urlMap = {};

  for (const [relPath, filePath] of filesToUpload.entries()) {
    console.log(`Uploading ${relPath}...`);
    try {
      const isVideo = filePath.endsWith('.mp4');
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: isVideo ? 'video' : 'image',
        folder: 'beewise', // Grouping in Cloudinary
        use_filename: true,
        unique_filename: false,
        overwrite: true
      });
      urlMap[relPath] = result.secure_url;
      console.log(`Uploaded! URL: ${result.secure_url}`);
    } catch (err) {
      console.error(`Error uploading ${relPath}:`, err);
    }
  }

  // Save the map to a JSON file for replacing later or debugging
  fs.writeFileSync('cloudinary_map.json', JSON.stringify(urlMap, null, 2));
  console.log('Upload complete. Map saved to cloudinary_map.json');

  // Now let's delete the large files from all apps
  for (const file of allHeavyFiles) {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted local file: ${file}`);
    } catch(e) {
      console.error(`Failed to delete ${file}`, e);
    }
  }
};

main().catch(console.error);
