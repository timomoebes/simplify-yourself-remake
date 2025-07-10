// main.js

console.log('JS loaded - ready for scroll-based background changes.');

// Placeholder: Add scroll event listeners and background change logic here. 

// Scroll-based background effect for hero section
const hero = document.querySelector('.hero');

function updateHeroBg() {
  if (!hero) return;
  // Get scroll progress (0 at top, 1 at 500px scroll)
  const scrollY = window.scrollY;
  const maxScroll = 500;
  const progress = Math.min(scrollY / maxScroll, 1);
  // Interpolate between two colors for the gradient
  // Start: #FF5C2A (orange), End: #000000 (black)
  const orange = [255, 92, 42];
  const black = [0, 0, 0];
  const r = Math.round(orange[0] + (black[0] - orange[0]) * progress);
  const g = Math.round(orange[1] + (black[1] - orange[1]) * progress);
  const b = Math.round(orange[2] + (black[2] - orange[2]) * progress);
  hero.style.background = `linear-gradient(120deg, rgb(${r},${g},${b}) 0%, #000 100%)`;
}

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(updateHeroBg);
});

// Initial call
updateHeroBg(); 

// Animated orbs in hero background
const canvas = document.getElementById('hero-orbs-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let orbs = [];
let mouse = { x: 0.5, y: 0.5 };

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}

function createOrbs(count) {
  const colors = [
    'rgba(255,92,42,0.18)',
    'rgba(255,92,42,0.28)',
    'rgba(255,255,255,0.10)',
    'rgba(255,92,42,0.10)'
  ];
  orbs = [];
  for (let i = 0; i < count; i++) {
    const radius = 40 + Math.random() * 60;
    orbs.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseX: 0,
      baseY: 0,
      radius,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.2 + Math.random() * 0.3,
      angle: Math.random() * Math.PI * 2,
      parallax: 0.08 + Math.random() * 0.12
    });
  }
}

function animateOrbs() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let orb of orbs) {
    // Parallax movement based on mouse
    orb.baseX = orb.x + (mouse.x - 0.5) * orb.parallax * canvas.width;
    orb.baseY = orb.y + (mouse.y - 0.5) * orb.parallax * canvas.height;
    // Floating animation
    orb.angle += orb.speed * 0.008;
    const floatX = Math.cos(orb.angle) * 10;
    const floatY = Math.sin(orb.angle) * 10;
    ctx.beginPath();
    ctx.arc(orb.baseX + floatX, orb.baseY + floatY, orb.radius, 0, Math.PI * 2);
    ctx.fillStyle = orb.color;
    ctx.shadowColor = orb.color;
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  requestAnimationFrame(animateOrbs);
}

function onMouseMove(e) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) / rect.width;
  mouse.y = (e.clientY - rect.top) / rect.height;
}

if (canvas && hero) {
  resizeCanvas();
  createOrbs(7);
  animateOrbs();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createOrbs(7);
  });
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.touches[0].clientX - rect.left) / rect.width;
      mouse.y = (e.touches[0].clientY - rect.top) / rect.height;
    }
  });
} 

// Smooth scroll to features section on scroll cue click
const scrollCue = document.getElementById('scroll-cue');
const featuresSection = document.querySelector('.features');
if (scrollCue && featuresSection) {
  scrollCue.addEventListener('click', () => {
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  });
} 

// Dynamically highlight the most recent post in the Featured Post section
const posts = [
  {
    title: 'The Magic of Walking: How a Simple Walk Can Spark More Creativity',
    date: '2023-09-29',
    displayDate: 'September 29, 2023',
    excerpt: 'Discover how Steve Jobs and Stanford research prove that walking can increase creativity by 60%. Learn why a simple 30-minute walk can unlock your best ideas and transform your thinking process.',
    link: 'posts/the-magic-of-walking.html',
    image: 'https://i0.wp.com/simplify-yourself.com/wp-content/uploads/2023/09/Die-magie-des-gehens-kreativ-Titel.jpg?fit=1152%2C768&ssl=1',
    imageAlt: 'Walking for creativity'
  },
  {
    title: 'Brrrrr-ings It Benefits? The Cold, Hard Truth About Cold Showers',
    date: '2023-01-26',
    displayDate: 'January 26, 2023',
    excerpt: 'Explore the surprising benefits of cold showers for your circulation, immune system, and mental well-being. Learn how cold exposure can boost your energy and transform your daily routine.',
    link: 'posts/cold-shower-benefits.html',
    image: 'https://i0.wp.com/simplify-yourself.com/wp-content/uploads/2023/01/Kalt-duschen-vorteile-titel.jpg?fit=1152%2C768&ssl=1',
    imageAlt: 'Cold shower benefits'
  },
  {
    title: 'Living Without Coffee Made Easy',
    date: '2016-10-22',
    displayDate: 'October 22, 2016',
    excerpt: 'Break your coffee dependency with this simple morning routine. Discover how drinking water instead of coffee can give you natural energy, better sleep, and improved health.',
    link: 'posts/living-without-coffee.html',
    image: 'https://i0.wp.com/simplify-yourself.com/wp-content/uploads/2015/08/5260718882_32ce02b522_z1.jpg?fit=640%2C471&ssl=1',
    imageAlt: 'Living without coffee'
  },
  {
    title: 'How You Can Live Without a Smartphone',
    date: '2015-11-16',
    displayDate: 'November 16, 2015',
    excerpt: 'Discover the freedom of living without a smartphone and breaking free from digital dependency. Learn how to reclaim your time and focus in our connected world.',
    link: 'posts/living-without-smartphone.html',
    image: 'https://i0.wp.com/simplify-yourself.com/wp-content/uploads/2015/08/batch_6873198157_d91b6c9395_z.jpg?fit=672%2C455&ssl=1',
    imageAlt: 'Living without smartphone'
  },
  {
    title: 'Gaining Financial Freedom - Through Self-Reward',
    date: '2015-10-23',
    displayDate: 'October 23, 2015',
    excerpt: 'Learn how to achieve financial freedom by saving 10% of your income through self-reward strategies and smart money habits. Transform your relationship with money.',
    link: 'posts/financial-freedom.html',
    image: 'https://i0.wp.com/simplify-yourself.com/wp-content/uploads/2015/08/money.jpg?fit=676%2C510&ssl=1',
    imageAlt: 'Financial freedom'
  },
  {
    title: 'Blog Start',
    date: '2015-08-04',
    displayDate: 'August 4, 2015',
    excerpt: 'Timo\'s very first blog post from August 2015 - the beginning of the Simplify Yourself journey and philosophy. Discover where it all started 10 years ago.',
    link: 'posts/blog-start.html',
    image: 'https://i0.wp.com/simplify-yourself.com/wp-content/uploads/2015/08/4942572797_898ec7ec75_b-e1438724148506.jpg?fit=682%2C510&ssl=1',
    imageAlt: 'Blog start journey'
  }
];

function getMostRecentPost(posts) {
  return posts.reduce((latest, post) =>
    new Date(post.date) > new Date(latest.date) ? post : latest, posts[0]);
}

function renderFeaturedPost(post) {
  const card = document.querySelector('.featured-card');
  if (!card) return;
  card.innerHTML = `
    <img class="featured-thumb" src="${post.image}" alt="${post.imageAlt}">
    <div class="featured-content">
      <h3 class="featured-post-title">${post.title}</h3>
      <p class="featured-post-date">${post.displayDate}</p>
      <p class="featured-post-excerpt">${post.excerpt}</p>
      <a href="${post.link}" class="featured-read-more">Read more</a>
    </div>
  `;
}

const mostRecent = getMostRecentPost(posts);
renderFeaturedPost(mostRecent);

// Back to Top Button Functionality
const backToTopButton = document.querySelector('.back-to-top');

function toggleBackToTopButton() {
  if (window.scrollY > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Add scroll event listener for back to top button
window.addEventListener('scroll', toggleBackToTopButton);

// Add click event listener for back to top button
if (backToTopButton) {
  backToTopButton.addEventListener('click', scrollToTop);
} 