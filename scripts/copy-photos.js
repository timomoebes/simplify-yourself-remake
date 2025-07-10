// Photo Copy Script
// Helps organize Instagram photos for the website

const fs = require('fs');
const path = require('path');

// Load the processed photos data
const photosDataPath = path.join(__dirname, '..', 'assets', 'images', 'americas-adventure', 'photos-data.json');
const photosData = JSON.parse(fs.readFileSync(photosDataPath, 'utf8'));

console.log('📸 Americas Adventure Photo Organization Helper');
console.log('='.repeat(50));
console.log(`Total posts: ${photosData.journey.totalPosts}`);
console.log(`Photos: ${photosData.journey.totalPhotos}`);
console.log(`Videos: ${photosData.journey.totalVideos}`);
console.log('');

console.log('📁 Steps to organize your photos:');
console.log('');

console.log('1. Create the directory structure:');
console.log('   mkdir -p assets/images/americas-adventure/optimized');
console.log('');

console.log('2. Copy photos from your media directories:');
console.log('   Your Instagram photos should be in paths like:');

// Show sample photo paths
const samplePosts = photosData.posts.slice(0, 5);
samplePosts.forEach(post => {
  console.log(`   ${post.fullPath}`);
});

console.log('   ...');
console.log('');

console.log('3. Optimize photos for web (recommended):');
console.log('   - Resize to max 1200px width');
console.log('   - Compress to 80-90% quality');
console.log('   - Use tools like ImageMagick or online compressors');
console.log('');

console.log('4. Copy optimized photos to:');
console.log('   assets/images/americas-adventure/optimized/');
console.log('   Keep the same filename structure');
console.log('');

console.log('📊 Photo breakdown by category:');
Object.entries(photosData.categories).forEach(([category, posts]) => {
  const photoCount = posts.filter(p => !p.isVideo).length;
  console.log(`   ${category}: ${photoCount} photos`);
});
console.log('');

console.log('📅 Monthly breakdown:');
Object.entries(photosData.monthlyPosts).forEach(([month, posts]) => {
  const photoCount = posts.filter(p => !p.isVideo).length;
  console.log(`   ${month}: ${photoCount} photos`);
});
console.log('');

console.log('🚀 Once photos are copied and optimized:');
console.log('   1. Update the image paths in americas-gallery.js');
console.log('   2. Test the gallery in your browser');
console.log('   3. The gallery will automatically load and display your photos!');
console.log('');

console.log('💡 Alternative approach:');
console.log('   Since you already have media in directories like 201607, 201608, etc.,');
console.log('   you could create symlinks or copy directly from those folders.');
console.log('');

// Generate a bash script to help with copying
const bashScript = `#!/bin/bash
# Americas Adventure Photo Copy Script
# Run this from your project root directory

echo "Creating directory structure..."
mkdir -p assets/images/americas-adventure/optimized

echo "Copying photos from media directories..."

${photosData.posts.filter(p => !p.isVideo).slice(0, 10).map(post => 
  `# Copy: ${post.fullPath}\n# cp "${post.fullPath}" "assets/images/americas-adventure/optimized/${post.filename}"`
).join('\n')}

# ... continue for all ${photosData.journey.totalPhotos} photos

echo "Photo copying complete!"
echo "Don't forget to optimize images for web performance."
`;

fs.writeFileSync(path.join(__dirname, '..', 'copy-photos.sh'), bashScript);
console.log('📝 Generated copy-photos.sh script for reference');
console.log('   (Edit the script to match your actual media directory paths)');