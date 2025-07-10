// Batch Photo Copy Script
// Automatically copies Instagram photos to the website directory

const fs = require('fs');
const path = require('path');

// Load the processed photos data
const photosDataPath = path.join(__dirname, '..', 'assets', 'images', 'americas-adventure', 'photos-data.json');
const photosData = JSON.parse(fs.readFileSync(photosDataPath, 'utf8'));

// Configuration
const SOURCE_MEDIA_DIR = 'media'; // Change this to your actual media directory path
const TARGET_DIR = path.join(__dirname, '..', 'assets', 'images', 'americas-adventure');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

function copyPhotos() {
  console.log('🚀 Starting photo copy process...');
  console.log('');
  
  // Ensure target directory exists
  ensureDirectoryExists(TARGET_DIR);
  
  let copiedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  // Only process photos (not videos)
  const photos = photosData.posts.filter(post => !post.isVideo);
  
  console.log(`📊 Processing ${photos.length} photos...`);
  console.log('');
  
  photos.forEach((photo, index) => {
    const sourcePath = path.join(__dirname, '..', photo.fullPath);
    const targetPath = path.join(TARGET_DIR, photo.filename);
    
    // Show progress every 50 photos
    if (index % 50 === 0) {
      console.log(`📸 Processing photo ${index + 1}/${photos.length}...`);
    }
    
    try {
      // Check if source file exists
      if (fs.existsSync(sourcePath)) {
        // Check if target file already exists
        if (!fs.existsSync(targetPath)) {
          // Copy the file
          fs.copyFileSync(sourcePath, targetPath);
          copiedCount++;
          
          if (index < 5) {
            console.log(`   ✅ Copied: ${photo.filename}`);
          }
        } else {
          skippedCount++;
          if (index < 5) {
            console.log(`   ⏭️  Skipped (exists): ${photo.filename}`);
          }
        }
      } else {
        errorCount++;
        if (index < 5) {
          console.log(`   ❌ Source not found: ${sourcePath}`);
        }
      }
    } catch (error) {
      errorCount++;
      if (index < 5) {
        console.log(`   ❌ Error copying ${photo.filename}: ${error.message}`);
      }
    }
  });
  
  console.log('');
  console.log('📈 Copy Summary:');
  console.log(`   ✅ Copied: ${copiedCount} photos`);
  console.log(`   ⏭️  Skipped: ${skippedCount} photos (already exist)`);
  console.log(`   ❌ Errors: ${errorCount} photos`);
  console.log('');
  
  if (errorCount > 0) {
    console.log('⚠️  Some photos could not be found or copied.');
    console.log('   Make sure your media directory structure matches:');
    console.log('   media/posts/YYYYMM/filename.jpg');
    console.log('');
    console.log('   You can update SOURCE_MEDIA_DIR in this script if needed.');
  }
  
  if (copiedCount > 0) {
    console.log('🎉 Photos successfully copied!');
    console.log('   Next steps:');
    console.log('   1. Open about.html in your browser');
    console.log('   2. The gallery should now display your photos');
    console.log('   3. Consider optimizing images for web if they\'re large');
  }
}

// Run the copy process
if (require.main === module) {
  copyPhotos();
}

module.exports = { copyPhotos };