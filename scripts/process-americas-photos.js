// Americas Adventure Photo Processor
// Automatically organizes Instagram photos from the Americas journey (2016-2017)

const fs = require('fs');
const path = require('path');

// Load Instagram posts data
const instagramPosts = JSON.parse(fs.readFileSync('../posts_1.json', 'utf8'));

// Americas journey timeframe (July 2016 - August 2017)
const JOURNEY_START = new Date('2016-07-01').getTime() / 1000;
const JOURNEY_END = new Date('2017-09-01').getTime() / 1000;

// Countries and regions for categorization
const AMERICAS_KEYWORDS = [
  'mexico', 'méxico', 'guatemala', 'belize', 'honduras', 'salvador', 'nicaragua',
  'costa rica', 'panama', 'colombia', 'ecuador', 'peru', 'bolivia', 'chile',
  'argentina', 'uruguay', 'brazil', 'brasil', 'patagonia', 'andes', 'amazon',
  'tequila', 'cusco', 'machu picchu', 'atacama', 'salar', 'montevideo', 'buenos aires',
  'rio', 'salvador', 'iguazu', 'cartagena', 'medellin', 'quito', 'lima', 'la paz'
];

function isAmericasPost(post, caption) {
  // Check if caption contains Americas-related keywords
  const lowerCaption = caption.toLowerCase();
  return AMERICAS_KEYWORDS.some(keyword => lowerCaption.includes(keyword));
}

function categorizeByLocation(caption, coordinates) {
  const lowerCaption = caption.toLowerCase();
  
  // Mexico & Central America
  if (lowerCaption.includes('mexico') || lowerCaption.includes('méxico') || 
      lowerCaption.includes('guatemala') || lowerCaption.includes('tequila')) {
    return 'Mexico & Central America';
  }
  
  // South America - North
  if (lowerCaption.includes('colombia') || lowerCaption.includes('ecuador') || 
      lowerCaption.includes('cartagena') || lowerCaption.includes('medellin')) {
    return 'Northern South America';
  }
  
  // Peru & Bolivia
  if (lowerCaption.includes('peru') || lowerCaption.includes('bolivia') || 
      lowerCaption.includes('cusco') || lowerCaption.includes('machu picchu') || 
      lowerCaption.includes('la paz') || lowerCaption.includes('salar')) {
    return 'Peru & Bolivia';
  }
  
  // Patagonia & Chile
  if (lowerCaption.includes('chile') || lowerCaption.includes('patagonia') || 
      lowerCaption.includes('atacama')) {
    return 'Chile & Patagonia';
  }
  
  // Argentina & Uruguay
  if (lowerCaption.includes('argentina') || lowerCaption.includes('uruguay') || 
      lowerCaption.includes('buenos aires') || lowerCaption.includes('montevideo')) {
    return 'Argentina & Uruguay';
  }
  
  // Brazil
  if (lowerCaption.includes('brazil') || lowerCaption.includes('brasil') || 
      lowerCaption.includes('rio') || lowerCaption.includes('iguazu')) {
    return 'Brazil';
  }
  
  return 'Americas Adventure';
}

function processAmericasPosts() {
  const americasPosts = [];
  let photoCount = 0;
  let videoCount = 0;
  
  instagramPosts.forEach((post, index) => {
    if (post.media && post.media.length > 0) {
      const media = post.media[0];
      const timestamp = media.creation_timestamp;
      const caption = media.title || '';
      
      // Filter for Americas journey timeframe
      if (timestamp >= JOURNEY_START && timestamp <= JOURNEY_END) {
        const date = new Date(timestamp * 1000);
        const coordinates = media.media_metadata?.photo_metadata?.exif_data?.[0] || 
                          media.media_metadata?.video_metadata?.exif_data?.[0];
        
        // Check if it's Americas-related or within timeframe
        const isAmericasRelated = isAmericasPost(post, caption);
        const isPhotoDuringJourney = true; // All photos during this timeframe are likely from the journey
        
        if (isAmericasRelated || isPhotoDuringJourney) {
          const mediaInfo = {
            filename: path.basename(media.uri),
            fullPath: media.uri,
            date: date.toISOString().split('T')[0], // YYYY-MM-DD
            month: date.toISOString().substring(0, 7), // YYYY-MM
            timestamp: timestamp,
            caption: caption,
            coordinates: coordinates ? {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude
            } : null,
            category: categorizeByLocation(caption, coordinates),
            isVideo: media.uri.includes('.mp4'),
            mediaType: media.uri.includes('.mp4') ? 'video' : 'photo'
          };
          
          americasPosts.push(mediaInfo);
          
          if (mediaInfo.isVideo) {
            videoCount++;
          } else {
            photoCount++;
          }
        }
      }
    }
  });
  
  // Sort by date
  americasPosts.sort((a, b) => a.timestamp - b.timestamp);
  
  console.log(`Found ${americasPosts.length} posts from Americas journey`);
  console.log(`Photos: ${photoCount}, Videos: ${videoCount}`);
  
  // Group by month for organization
  const monthlyPosts = {};
  americasPosts.forEach(post => {
    if (!monthlyPosts[post.month]) {
      monthlyPosts[post.month] = [];
    }
    monthlyPosts[post.month].push(post);
  });
  
  console.log('Monthly breakdown:');
  Object.keys(monthlyPosts).sort().forEach(month => {
    console.log(`${month}: ${monthlyPosts[month].length} posts`);
  });
  
  // Save organized data
  const outputData = {
    journey: {
      title: "Americas Adventure 2016-2017",
      description: "14-month journey through the Americas",
      startDate: "2016-07-01",
      endDate: "2017-08-31",
      totalPosts: americasPosts.length,
      totalPhotos: photoCount,
      totalVideos: videoCount
    },
    posts: americasPosts,
    monthlyPosts: monthlyPosts,
    categories: groupByCategory(americasPosts)
  };
  
  // Create directories
  if (!fs.existsSync('../assets')) fs.mkdirSync('../assets');
  if (!fs.existsSync('../assets/images')) fs.mkdirSync('../assets/images');
  if (!fs.existsSync('../assets/images/americas-adventure')) fs.mkdirSync('../assets/images/americas-adventure');
  
  // Save the processed data
  fs.writeFileSync('../assets/images/americas-adventure/photos-data.json', 
                   JSON.stringify(outputData, null, 2));
  
  console.log('✅ Photos data saved to assets/images/americas-adventure/photos-data.json');
  
  return outputData;
}

function groupByCategory(posts) {
  const categories = {};
  posts.forEach(post => {
    if (!categories[post.category]) {
      categories[post.category] = [];
    }
    categories[post.category].push(post);
  });
  return categories;
}

// Run the processor
if (require.main === module) {
  processAmericasPosts();
}

module.exports = { processAmericasPosts };