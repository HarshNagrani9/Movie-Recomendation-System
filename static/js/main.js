// document.addEventListener('DOMContentLoaded', function() {
//     // DOM Elements
//     const movieSearchInput = document.getElementById('movie-search');
//     const searchBtn = document.getElementById('search-btn');
//     const genreFilter = document.getElementById('genre-filter');
//     const searchResults = document.getElementById('search-results');
//     const selectedMovies = document.getElementById('selected-movies');
//     const numRecommendationsInput = document.getElementById('num-recommendations');
//     const getRecommendationsBtn = document.getElementById('get-recommendations-btn');
//     const recommendationsSection = document.querySelector('.recommendations-section');
//     const recommendations = document.getElementById('recommendations');
//     const clearBtn = document.getElementById('clear-btn');
    
//     // State
//     const selectedMovieIds = new Set();
    
//     // Init - Load initial movies by genre
//     loadMoviesByGenre('');
    
//     // Event Listeners
//     searchBtn.addEventListener('click', searchMovies);
//     movieSearchInput.addEventListener('keyup', function(e) {
//         if (e.key === 'Enter') {
//             searchMovies();
//         }
//     });
    
//     genreFilter.addEventListener('change', function() {
//         loadMoviesByGenre(this.value);
//     });
    
//     getRecommendationsBtn.addEventListener('click', getRecommendations);
//     clearBtn.addEventListener('click', clearAll);
    
//     // Functions
//     function searchMovies() {
//         const searchTerm = movieSearchInput.value.trim();
        
//         if (searchTerm === '') {
//             loadMoviesByGenre(genreFilter.value);
//             return;
//         }
        
//         fetch('/search_movies', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ searchTerm })
//         })
//         .then(response => response.json())
//         .then(movies => {
//             displayMovies(movies, searchResults, true);
//         })
//         .catch(error => console.error('Error searching movies:', error));
//     }
    
//     function loadMoviesByGenre(genre) {
//         fetch('/filter_movies', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ genre, limit: 50 })
//         })
//         .then(response => response.json())
//         .then(movies => {
//             displayMovies(movies, searchResults, true);
//         })
//         .catch(error => console.error('Error loading movies by genre:', error));
//     }
    
//     function displayMovies(movies, container, addButton = false) {
//         container.innerHTML = '';
        
//         if (movies.length === 0) {
//             container.innerHTML = '<p>No movies found</p>';
//             return;
//         }
        
//         movies.forEach(movie => {
//             const movieItem = document.createElement('div');
//             movieItem.className = 'movie-item';
//             movieItem.dataset.movieId = movie.movieId;
            
//             const movieInfo = document.createElement('div');
//             movieInfo.className = 'movie-info';
            
//             const title = document.createElement('div');
//             title.className = 'movie-title';
//             title.textContent = movie.title;
//             title.addEventListener('click', () => {
//                 window.location.href = `/movie/${movie.movieId}`;
//             });
            
//             const genres = document.createElement('div');
//             genres.className = 'movie-genres';
//             genres.textContent = movie.genres;
            
//             movieInfo.appendChild(title);
//             movieInfo.appendChild(genres);
            
//             movieItem.appendChild(movieInfo);
            
//             if (addButton) {
//                 const actions = document.createElement('div');
//                 actions.className = 'movie-actions';
                
//                 const addBtn = document.createElement('button');
                
//                 if (selectedMovieIds.has(movie.movieId)) {
//                     addBtn.textContent = 'Selected';
//                     addBtn.disabled = true;
//                 } else {
//                     addBtn.textContent = 'Select';
//                     addBtn.addEventListener('click', () => addToSelected(movie));
//                 }
                
//                 actions.appendChild(addBtn);
//                 movieItem.appendChild(actions);
//             } else {
//                 const removeBtn = document.createElement('button');
//                 removeBtn.textContent = 'Remove';
//                 removeBtn.addEventListener('click', () => removeFromSelected(movie.movieId));
                
//                 const actions = document.createElement('div');
//                 actions.className = 'movie-actions';
//                 actions.appendChild(removeBtn);
//                 movieItem.appendChild(actions);
//             }
            
//             container.appendChild(movieItem);
//         });
//     }
    
//     function addToSelected(movie) {
//         if (!selectedMovieIds.has(movie.movieId)) {
//             selectedMovieIds.add(movie.movieId);
//             displayMovies([movie], selectedMovies, false);
//             updateSelectedMoviesUI();
            
//             // Update the search results to show the movie as selected
//             const searchMovieItem = searchResults.querySelector(`[data-movie-id="${movie.movieId}"]`);
//             if (searchMovieItem) {
//                 const addBtn = searchMovieItem.querySelector('button');
//                 addBtn.textContent = 'Selected';
//                 addBtn.disabled = true;
//             }
//         }
//     }
    
//     function removeFromSelected(movieId) {
//         selectedMovieIds.delete(movieId);
        
//         const movieToRemove = selectedMovies.querySelector(`[data-movie-id="${movieId}"]`);
//         if (movieToRemove) {
//             selectedMovies.removeChild(movieToRemove);
//         }
        
//         updateSelectedMoviesUI();
        
//         // Update the search results to show the movie as not selected
//         const searchMovieItem = searchResults.querySelector(`[data-movie-id="${movieId}"]`);
//         if (searchMovieItem) {
//             const addBtn = searchMovieItem.querySelector('button');
//             addBtn.textContent = 'Select';
//             addBtn.disabled = false;
//             addBtn.onclick = () => {
//                 const movieTitle = searchMovieItem.querySelector('.movie-title').textContent;
//                 const movieGenres = searchMovieItem.querySelector('.movie-genres').textContent;
//                 addToSelected({ movieId, title: movieTitle, genres: movieGenres });
//             };
//         }
//     }
    
//     function updateSelectedMoviesUI() {
//         getRecommendationsBtn.disabled = selectedMovieIds.size === 0;
        
//         if (selectedMovieIds.size === 0) {
//             selectedMovies.innerHTML = '<p>No movies selected yet</p>';
//         }
//     }
    
//     function getRecommendations() {
//         const numRecommendations = parseInt(numRecommendationsInput.value) || 10;
        
//         fetch('/recommend', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 selectedMovies: Array.from(selectedMovieIds),
//                 numRecommendations
//             })
//         })
//         .then(response => response.json())
//         .then(recommendedMovies => {
//             if (recommendedMovies.error) {
//                 alert(recommendedMovies.error);
//                 return;
//             }
            
//             recommendationsSection.classList.remove('hidden');
//             displayMovies(recommendedMovies, recommendations, true);
            
//             // Scroll to recommendations
//             recommendationsSection.scrollIntoView({ behavior: 'smooth' });
//         })
//         .catch(error => console.error('Error getting recommendations:', error));
//     }
    
//     function clearAll() {
//         selectedMovieIds.clear();
//         selectedMovies.innerHTML = '<p>No movies selected yet</p>';
//         recommendations.innerHTML = '';
//         recommendationsSection.classList.add('hidden');
//         getRecommendationsBtn.disabled = true;
        
//         // Reset the search and filter
//         movieSearchInput.value = '';
//         genreFilter.value = '';
//         loadMoviesByGenre('');
//     }
    
//     // Initialize with empty selected movies message
//     if (selectedMovieIds.size === 0) {
//         selectedMovies.innerHTML = '<p>No movies selected yet</p>';
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const movieSearchInput = document.getElementById('movie-search');
    const searchBtn = document.getElementById('search-btn');
    const genreFilter = document.getElementById('genre-filter');
    const searchResults = document.getElementById('search-results');
    const selectedMovies = document.getElementById('selected-movies');
    const numRecommendationsInput = document.getElementById('num-recommendations');
    const getRecommendationsBtn = document.getElementById('get-recommendations-btn');
    const recommendationsSection = document.querySelector('.recommendations-section');
    const recommendations = document.getElementById('recommendations');
    const clearBtn = document.getElementById('clear-btn');
    
    // State
    const selectedMovieIds = new Set();
    
    // Init - Load initial movies by genre
    loadMoviesByGenre('');
    
    // Event Listeners
    searchBtn.addEventListener('click', searchMovies);
    movieSearchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });
    
    genreFilter.addEventListener('change', function() {
        loadMoviesByGenre(this.value);
    });
    
    getRecommendationsBtn.addEventListener('click', getRecommendations);
    clearBtn.addEventListener('click', clearAll);
    
    // Functions
    function handleApiError(error, defaultMessage) {
        console.error(defaultMessage, error);
        alert(`${defaultMessage}. Please check the console for details.`);
    }
    
    function searchMovies() {
        const searchTerm = movieSearchInput.value.trim();
        
        if (searchTerm === '') {
            loadMoviesByGenre(genreFilter.value);
            return;
        }
        
        // Show loading indicator
        searchResults.innerHTML = '<p>Searching...</p>';
        
        fetch('/search_movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(movies => {
            displayMovies(movies, searchResults, true);
        })
        .catch(error => {
            handleApiError(error, 'Error searching movies');
            searchResults.innerHTML = '<p>Error searching movies. Please try again.</p>';
        });
    }
    
    function loadMoviesByGenre(genre) {
        // Show loading indicator
        searchResults.innerHTML = '<p>Loading movies...</p>';
        
        fetch('/filter_movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ genre, limit: 50 })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(movies => {
            displayMovies(movies, searchResults, true);
        })
        .catch(error => {
            handleApiError(error, 'Error loading movies by genre');
            searchResults.innerHTML = '<p>Error loading movies. Please try again.</p>';
        });
    }
    
    function displayMovies(movies, container, addButton = false) {
        container.innerHTML = '';
        
        if (!movies || movies.length === 0) {
            container.innerHTML = '<p>No movies found</p>';
            return;
        }
        
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.className = 'movie-item';
            movieItem.dataset.movieId = movie.movieId;
            
            const movieInfo = document.createElement('div');
            movieInfo.className = 'movie-info';
            
            const title = document.createElement('div');
            title.className = 'movie-title';
            title.textContent = movie.title || 'Unknown Title';
            title.addEventListener('click', () => {
                window.location.href = `/movie/${movie.movieId}`;
            });
            
            const genres = document.createElement('div');
            genres.className = 'movie-genres';
            genres.textContent = movie.genres || 'No genres listed';
            
            movieInfo.appendChild(title);
            movieInfo.appendChild(genres);
            
            movieItem.appendChild(movieInfo);
            
            if (addButton) {
                const actions = document.createElement('div');
                actions.className = 'movie-actions';
                
                const addBtn = document.createElement('button');
                
                if (selectedMovieIds.has(movie.movieId)) {
                    addBtn.textContent = 'Selected';
                    addBtn.disabled = true;
                } else {
                    addBtn.textContent = 'Select';
                    addBtn.addEventListener('click', () => addToSelected(movie));
                }
                
                actions.appendChild(addBtn);
                movieItem.appendChild(actions);
            } else {
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.addEventListener('click', () => removeFromSelected(movie.movieId));
                
                const actions = document.createElement('div');
                actions.className = 'movie-actions';
                actions.appendChild(removeBtn);
                movieItem.appendChild(actions);
            }
            
            container.appendChild(movieItem);
        });
    }
    
    function addToSelected(movie) {
        if (!selectedMovieIds.has(movie.movieId)) {
            selectedMovieIds.add(movie.movieId);
            displayMovies([movie], selectedMovies, false);
            updateSelectedMoviesUI();
            
            // Update the search results to show the movie as selected
            const searchMovieItem = searchResults.querySelector(`[data-movie-id="${movie.movieId}"]`);
            if (searchMovieItem) {
                const addBtn = searchMovieItem.querySelector('button');
                addBtn.textContent = 'Selected';
                addBtn.disabled = true;
            }
        }
    }
    
    function removeFromSelected(movieId) {
        selectedMovieIds.delete(movieId);
        
        const movieToRemove = selectedMovies.querySelector(`[data-movie-id="${movieId}"]`);
        if (movieToRemove) {
            selectedMovies.removeChild(movieToRemove);
        }
        
        updateSelectedMoviesUI();
        
        // Update the search results to show the movie as not selected
        const searchMovieItem = searchResults.querySelector(`[data-movie-id="${movieId}"]`);
        if (searchMovieItem) {
            const addBtn = searchMovieItem.querySelector('button');
            addBtn.textContent = 'Select';
            addBtn.disabled = false;
            addBtn.onclick = () => {
                const movieTitle = searchMovieItem.querySelector('.movie-title').textContent;
                const movieGenres = searchMovieItem.querySelector('.movie-genres').textContent;
                addToSelected({ movieId, title: movieTitle, genres: movieGenres });
            };
        }
    }
    
    function updateSelectedMoviesUI() {
        getRecommendationsBtn.disabled = selectedMovieIds.size === 0;
        
        if (selectedMovieIds.size === 0) {
            selectedMovies.innerHTML = '<p>No movies selected yet</p>';
        }
    }
    
    function getRecommendations() {
        const numRecommendations = parseInt(numRecommendationsInput.value) || 10;
        
        // Show loading indicator
        recommendationsSection.classList.remove('hidden');
        recommendations.innerHTML = '<p>Loading recommendations...</p>';
        
        console.log('Selected movie IDs:', Array.from(selectedMovieIds));
        console.log('Number of recommendations:', numRecommendations);
        
        // Fetch recommendations
        fetch('/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                selectedMovies: Array.from(selectedMovieIds),
                numRecommendations: numRecommendations
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();  // Get text first to debug
        })
        .then(text => {
            console.log('Raw response:', text);
            try {
                return JSON.parse(text);  // Then parse as JSON
            } catch (e) {
                console.error('Error parsing JSON:', e);
                throw new Error('Invalid JSON response');
            }
        })
        .then(recommendedMovies => {
            console.log('Parsed recommendations:', recommendedMovies);
            
            if (recommendedMovies.error) {
                throw new Error(recommendedMovies.error);
            }
            
            if (!recommendedMovies || recommendedMovies.length === 0) {
                recommendations.innerHTML = '<p>No similar movies found. Try selecting different movies.</p>';
                return;
            }
            
            displayMovies(recommendedMovies, recommendations, true);
            
            // Scroll to recommendations
            recommendationsSection.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Error getting recommendations:', error);
            recommendations.innerHTML = '<p>Error loading recommendations. Please try again.</p>';
        });
    }
    
    function clearAll() {
        selectedMovieIds.clear();
        selectedMovies.innerHTML = '<p>No movies selected yet</p>';
        recommendations.innerHTML = '';
        recommendationsSection.classList.add('hidden');
        getRecommendationsBtn.disabled = true;
        
        // Reset the search and filter
        movieSearchInput.value = '';
        genreFilter.value = '';
        loadMoviesByGenre('');
    }
    
    // Initialize with empty selected movies message
    if (selectedMovieIds.size === 0) {
        selectedMovies.innerHTML = '<p>No movies selected yet</p>';
    }
});