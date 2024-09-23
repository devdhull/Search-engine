document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchHistory = document.getElementById('searchHistory');
    const clearHistoryButton = document.getElementById('clearHistoryButton');
    const historyButton = document.getElementById('historyButton');
    const historyDropdown = document.getElementById('historyDropdown');
    const photoResults = document.getElementById('photoResults');

    const UNSPLASH_ACCESS_KEY = 'fLr9W5LJqMlisE8Nphq4FJ0J9opciv1WEarOghxXhkE';

    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    function updateHistoryDisplay() {
        searchHistory.innerHTML = '';
        history.forEach((term, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${term}
                <button class="removeBtn" data-index="${index}">Remove</button>
            `;
            searchHistory.appendChild(li);
        });

        document.querySelectorAll('.removeBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removeFromHistory(index);
            });
        });
    }

    function addToHistory(term) {
        if (!history.includes(term)) {
            history.unshift(term);
            if (history.length > 5) {
                history.pop();
            }
            localStorage.setItem('searchHistory', JSON.stringify(history));
            updateHistoryDisplay();
        }
    }

    function removeFromHistory(index) {
        history.splice(index, 1);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        updateHistoryDisplay();
    }

    async function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            addToHistory(searchTerm);
            searchInput.value = '';
            
            try {
                const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=12`, {
                    headers: {
                        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                    }
                });
                const data = await response.json();
                displayPhotoResults(data.results);
            } catch (error) {
                console.error('Error fetching photos:', error);
                photoResults.innerHTML = '<p>An error occurred while fetching photos. Please try again.</p>';
            }
        }
    }

    function displayPhotoResults(photos) {
        photoResults.innerHTML = '';
        photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.urls.small;
            img.alt = photo.alt_description || 'Unsplash photo';
            img.addEventListener('click', () => window.open(photo.links.html, '_blank'));
            photoResults.appendChild(img);
        });
    }

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    clearHistoryButton.addEventListener('click', () => {
        history = [];
        localStorage.removeItem('searchHistory');
        updateHistoryDisplay();
    });

    historyButton.addEventListener('click', () => {
        historyDropdown.classList.toggle('show');
    });

    window.addEventListener('click', (event) => {
        if (!event.target.matches('#historyButton')) {
            if (historyDropdown.classList.contains('show')) {
                historyDropdown.classList.remove('show');
            }
        }
    });

    updateHistoryDisplay();
});