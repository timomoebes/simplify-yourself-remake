const fs = require('fs');
const path = require('path');

const photosDir = path.join(__dirname, '..', 'assets', 'images', 'americas-adventure');
const outputFile = path.join(photosDir, 'photos-data.json');

const journeyInfo = {
  title: "14 Months Across the Americas",
  description: "A visual journey of my 14-month adventure across 11 countries in North and South America. This gallery captures the landscapes, cultures, and moments that defined this life-changing experience.",
  totalPhotos": 0,
  totalVideos: 0
};

const categories = {
  "Landscapes": "Scenic views from mountains to deserts",
  "Cities": "Urban exploration and city life",
  "People": "Portraits and moments with locals",
  "Food": "Culinary discoveries along the way",
  "Adventure": "Hiking, camping, and outdoor activities"
};

const monthlyPosts = {
  "2016-07": [], "2016-08": [], "2016-09": [], "2016-10": [], "2016-11": [], "2016-12": [],
  "2017-01": [], "2017-02": [], "2017-03": [], "2017-04": [], "2017-05": [], "2017-06": [],
  "2017-07": [], "2017-08": []
};

const categoryKeys = Object.keys(categories);

fs.readdir(photosDir, (err, files) => {
  if (err) {
    console.error('Error reading photos directory:', err);
    return;
  }

  const imageFiles = files.filter(file => file.endsWith('.jpg'));
  journeyInfo.totalPhotos = imageFiles.length;

  const posts = imageFiles.map((file, index) => {
    const monthIndex = Math.floor(index / (imageFiles.length / 14));
    const monthKey = Object.keys(monthlyPosts)[monthIndex];
    const category = categoryKeys[index % categoryKeys.length];
    
    const post = {
      fullPath: `assets/images/americas-adventure/${file}`,
      date: new Date(2016, 6 + monthIndex, (index % 28) + 1).toISOString(),
      caption: `Photo number ${index + 1} from the Americas adventure.`,
      category: category,
      month: monthKey,
      isVideo: false,
      coordinates: null
    };
    
    if (monthlyPosts[monthKey]) {
        monthlyPosts[monthKey].push(post);
    }

    return post;
  });

  const photosData = {
    journey: journeyInfo,
    categories: categories,
    monthlyPosts: monthlyPosts,
    posts: posts
  };

  fs.writeFile(outputFile, JSON.stringify(photosData, null, 2), (err) => {
    if (err) {
      console.error('Error writing photos-data.json:', err);
      return;
    }
    console.log('Successfully generated photos-data.json');
  });
});
