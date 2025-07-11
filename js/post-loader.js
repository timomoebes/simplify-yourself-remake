document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    
    if (postsContainer) {
        fetch('../posts.json')
            .then(response => response.json())
            .then(postFiles => {
                const posts = [];

                const fetchPromises = postFiles.map(file =>
                    fetch(`../${file}`)
                        .then(response => response.text())
                        .then(html => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            
                            const title = doc.querySelector('.post-title')?.textContent || '';
                            const date = doc.querySelector('.post-date')?.textContent || '';
                            const categories = Array.from(doc.querySelectorAll('.post-categories .category')).map(cat => `<span class="category">${cat.textContent}</span>`).join('');
                            const excerpt = doc.querySelector('.post-body > p')?.textContent || '';
                            const postUrl = file;

                            const postElement = document.createElement('article');
                            postElement.classList.add('post');
                            postElement.innerHTML = `
                                <h2 class="post-title">${title}</h2>
                                <p class="post-date">${date}</p>
                                <div class="post-categories">${categories}</div>
                                <p class="post-excerpt">${excerpt}</p>
                                <a href="${postUrl}" class="read-more">Read more</a>
                            `;
                            
                            posts.push({
                                element: postElement,
                                date: new Date(date)
                            });
                        })
                );

                Promise.all(fetchPromises).then(() => {
                    // Sort posts by date in descending order
                    posts.sort((a, b) => b.date - a.date);

                    // Create a fragment to append sorted posts
                    const fragment = document.createDocumentFragment();
                    posts.forEach(post => {
                        fragment.appendChild(post.element);
                    });

                    postsContainer.appendChild(fragment);

                    // Now that all posts are loaded and sorted, initialize the search
                    if (typeof BlogSearch !== 'undefined') {
                        new BlogSearch();
                    }
                });
            })
            .catch(error => {
                console.error('Error loading blog posts:', error);
                postsContainer.innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
            });
    }
});
