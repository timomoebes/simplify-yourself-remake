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
  
  // Check if we're in light mode
  const isLightMode = document.documentElement.classList.contains('light-mode');
  
  if (isLightMode) {
    // Light mode: interpolate between orange and light gray
    const orange = [255, 92, 42];
    const lightGray = [240, 240, 240];
    const r = Math.round(orange[0] + (lightGray[0] - orange[0]) * progress);
    const g = Math.round(orange[1] + (lightGray[1] - orange[1]) * progress);
    const b = Math.round(orange[2] + (lightGray[2] - orange[2]) * progress);
    hero.style.background = `linear-gradient(120deg, rgb(${r},${g},${b}) 0%, #f0f0f0 100%)`;
  } else {
    // Dark mode: interpolate between orange and black
    const orange = [255, 92, 42];
    const black = [0, 0, 0];
    const r = Math.round(orange[0] + (black[0] - orange[0]) * progress);
    const g = Math.round(orange[1] + (black[1] - orange[1]) * progress);
    const b = Math.round(orange[2] + (black[2] - orange[2]) * progress);
    hero.style.background = `linear-gradient(120deg, rgb(${r},${g},${b}) 0%, #000 100%)`;
  }
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
    title: 'Don\'t Forget Your Handwriting',
    date: '2019-07-11',
    displayDate: 'July 11, 2019',
    excerpt: 'Rediscover the importance of handwriting in our digital age. Learn why putting pen to paper can enhance creativity, mindfulness, and personal expression.',
    link: 'posts/dont-forget-your-handwriting.html',
    image: 'https://i0.wp.com/simplify-yourself.com/wp-content/uploads/2019/07/IMG_2190.jpg',
    imageAlt: 'Handwriting with pen on paper'
  },
  {
    title: 'No Real Relationships Anymore?',
    date: '2016-12-09',
    displayDate: 'December 9, 2016',
    excerpt: 'Exploring why modern relationships seem increasingly non-committal and superficial. Are we avoiding deep connections out of fear or too many choices?',
    link: 'posts/no-real-relationships-anymore.html',
    image: 'https://i0.wp.com/simplify-yourself.com/wp-content/uploads/2016/12/2016-12-08-11.54.25-1.jpg',
    imageAlt: 'Modern relationships and connections'
  },
  {
    title: 'What \'The Godfather\' Means About Family',
    date: '2015-10-15',
    displayDate: 'October 15, 2015',
    excerpt: 'Exploring the deeper meaning of family connections and the unconditional love that defines our most precious relationships. Inspired by timeless wisdom about family bonds.',
    link: 'posts/what-the-godfather-means-about-family.html',
    image: 'https://i0.wp.com/simplify-yourself.com/wp-content/uploads/2015/10/Familie.jpg?fit=720%2C478&ssl=1',
    imageAlt: 'Family gathering representing connection and love'
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

// Dark mode toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

// Check for saved theme preference or default to dark mode
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  rootElement.classList.add('light-mode');
  if (themeToggle) themeToggle.textContent = '☀️';
  // Update hero background for light mode
  updateHeroBg();
}

// Toggle theme function
function toggleTheme() {
  const isLightMode = rootElement.classList.contains('light-mode');
  
  if (isLightMode) {
    rootElement.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    if (themeToggle) themeToggle.textContent = '🌙';
  } else {
    rootElement.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    if (themeToggle) themeToggle.textContent = '☀️';
  }
  
  // Update hero background for current scroll position
  updateHeroBg();
}

// Add click event listener for theme toggle
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

// Contact Form Functionality
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');

// Form validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateForm(formData) {
  let isValid = true;
  const errors = {};

  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(error => error.textContent = '');

  // Validate name
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
    isValid = false;
  }

  // Validate email
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Validate subject
  if (!formData.subject.trim()) {
    errors.subject = 'Subject is required';
    isValid = false;
  } else if (formData.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters';
    isValid = false;
  }

  // Validate message
  if (!formData.message.trim()) {
    errors.message = 'Message is required';
    isValid = false;
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
    isValid = false;
  }

  // Display errors
  Object.keys(errors).forEach(field => {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
      errorElement.textContent = errors[field];
    }
  });

  return isValid;
}

function setLoadingState(loading) {
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  
  if (loading) {
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;
  } else {
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
  }
}

function showSuccessMessage() {
  contactForm.style.display = 'none';
  formSuccess.style.display = 'block';
  
  // Scroll to success message
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Reset form after 5 seconds
  setTimeout(() => {
    contactForm.style.display = 'block';
    formSuccess.style.display = 'none';
    contactForm.reset();
  }, 5000);
}

function handleFormSubmit(event) {
  event.preventDefault();
  
  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };

  // Validate form
  if (!validateForm(formData)) {
    return;
  }

  // Set loading state
  setLoadingState(true);

  // Simulate form submission (replace with actual backend integration)
  setTimeout(() => {
    // For now, create a mailto link as fallback
    const mailtoLink = `mailto:hello@simplify-yourself.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    setLoadingState(false);
    showSuccessMessage();
  }, 1500);
}

// Add form submit event listener
if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}

// Add real-time validation
const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
formInputs.forEach(input => {
  input.addEventListener('blur', () => {
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };
    
    // Only validate the specific field that lost focus
    const field = input.id;
    const errorElement = document.getElementById(`${field}-error`);
    
    if (field === 'name') {
      if (!formData.name.trim()) {
        errorElement.textContent = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        errorElement.textContent = 'Name must be at least 2 characters';
      } else {
        errorElement.textContent = '';
      }
    } else if (field === 'email') {
      if (!formData.email.trim()) {
        errorElement.textContent = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        errorElement.textContent = 'Please enter a valid email address';
      } else {
        errorElement.textContent = '';
      }
    } else if (field === 'subject') {
      if (!formData.subject.trim()) {
        errorElement.textContent = 'Subject is required';
      } else if (formData.subject.trim().length < 3) {
        errorElement.textContent = 'Subject must be at least 3 characters';
      } else {
        errorElement.textContent = '';
      }
    } else if (field === 'message') {
      if (!formData.message.trim()) {
        errorElement.textContent = 'Message is required';
      } else if (formData.message.trim().length < 10) {
        errorElement.textContent = 'Message must be at least 10 characters';
      } else {
        errorElement.textContent = '';
      }
    }
  });
}); 