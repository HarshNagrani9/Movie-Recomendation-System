# import pandas as pd
# import numpy as np
# from sklearn.feature_extraction.text import CountVectorizer
# from sklearn.metrics.pairwise import cosine_similarity

# def prepare_data(movies_df):
#     # Replace '|' with ' ' to create a string of genres for each movie
#     movies_df['genres_list'] = movies_df['genres'].str.replace('|', ' ')
#     return movies_df

# def compute_similarity(movies_df):
#     # Create a Count Vectorizer to convert genre strings to a matrix
#     count_vectorizer = CountVectorizer()
    
#     # Apply the vectorizer to the genres
#     genre_matrix = count_vectorizer.fit_transform(movies_df['genres_list'])
    
#     # Compute cosine similarity between all movies
#     cosine_sim = cosine_similarity(genre_matrix, genre_matrix)
    
#     return cosine_sim

# def get_recommendations(movies_df, movie_ids, num_recommendations=10):
#     """
#     Get movie recommendations based on selected movies and genre similarity
#     """
#     # Prepare data
#     movies_df = prepare_data(movies_df)
    
#     # Compute similarity matrix
#     cosine_sim = compute_similarity(movies_df)
    
#     # Create a Series with movie indices and titles for quick lookup
#     indices = pd.Series(movies_df.index, index=movies_df['movieId'])
    
#     # Get the indices of the selected movies
#     movie_indices = [indices[movie_id] for movie_id in movie_ids if movie_id in indices]
    
#     if not movie_indices:
#         return pd.DataFrame()
    
#     # Get the similarity scores for all movies based on the selected movies
#     sim_scores = np.zeros(len(movies_df))
#     for idx in movie_indices:
#         sim_scores += cosine_sim[idx]
    
#     # If multiple movies are selected, average the similarity scores
#     if len(movie_indices) > 1:
#         sim_scores /= len(movie_indices)
    
#     # Create a list of (movie index, similarity score)
#     sim_scores = list(enumerate(sim_scores))
    
#     # Sort the movies based on the similarity scores
#     sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
#     # Get the movie indices of the recommended movies
#     movie_indices = [i[0] for i in sim_scores if i[0] not in movie_indices]
    
#     # Get the top N recommended movies
#     movie_indices = movie_indices[:num_recommendations]
    
#     # Return the top N movies
#     return movies_df.iloc[movie_indices][['movieId', 'title', 'genres']]

# def get_top_movies_by_genre(movies_df, genre, limit=50):
#     """
#     Get top movies for a specific genre
#     """
#     if not genre:
#         # If no genre is selected, return some popular movies (using movieId as a proxy for popularity)
#         return movies_df.sort_values('movieId').head(limit)[['movieId', 'title', 'genres']]
    
#     # Filter movies by genre
#     filtered_movies = movies_df[movies_df['genres'].str.contains(genre)]
    
#     # Sort by movieId (as a simple proxy for popularity) and return top N
#     return filtered_movies.sort_values('movieId').head(limit)[['movieId', 'title', 'genres']]

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def prepare_data(movies_df):
    """
    Prepares the movie data for recommendation by creating a genre list column
    """
    try:
        # Create a copy to avoid modifying the original dataframe
        df = movies_df.copy()
        
        # Replace '|' with ' ' to create a string of genres for each movie
        df['genres_list'] = df['genres'].fillna('').astype(str).apply(lambda x: x.replace('|', ' '))
        return df
    except Exception as e:
        logger.error(f"Error in prepare_data: {str(e)}")
        raise

def compute_similarity(movies_df):
    """
    Computes the cosine similarity matrix based on movie genres
    """
    try:
        # Create a Count Vectorizer to convert genre strings to a matrix
        count_vectorizer = CountVectorizer()
        
        # Apply the vectorizer to the genres
        genre_matrix = count_vectorizer.fit_transform(movies_df['genres_list'])
        
        # Compute cosine similarity between all movies
        cosine_sim = cosine_similarity(genre_matrix, genre_matrix)
        
        return cosine_sim
    except Exception as e:
        logger.error(f"Error in compute_similarity: {str(e)}")
        raise

def get_recommendations(movies_df, movie_ids, num_recommendations=10):
    """
    Get movie recommendations based on selected movies and genre similarity
    """
    try:
        logger.info(f"Getting recommendations for movie IDs: {movie_ids}, count: {num_recommendations}")
        
        # Convert movie_ids to integers
        movie_ids = [int(movie_id) for movie_id in movie_ids]
        
        # Prepare data
        movies_df = prepare_data(movies_df)
        
        # Compute similarity matrix
        cosine_sim = compute_similarity(movies_df)
        
        # Create a Series with movie indices and titles for quick lookup
        indices = pd.Series(movies_df.index, index=movies_df['movieId']).to_dict()
        
        # Get the indices of the selected movies
        movie_indices = []
        for movie_id in movie_ids:
            if movie_id in indices:
                movie_indices.append(indices[movie_id])
            else:
                logger.warning(f"Movie ID {movie_id} not found in dataset")
        
        if not movie_indices:
            logger.warning("No valid movie indices found")
            return pd.DataFrame(columns=['movieId', 'title', 'genres'])
        
        # Get the similarity scores for all movies based on the selected movies
        sim_scores = np.zeros(len(movies_df))
        for idx in movie_indices:
            sim_scores += cosine_sim[idx]
        
        # If multiple movies are selected, average the similarity scores
        if len(movie_indices) > 1:
            sim_scores /= len(movie_indices)
        
        # Create a list of (movie index, similarity score)
        sim_scores = list(enumerate(sim_scores))
        
        # Sort the movies based on the similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get the movie indices of the recommended movies
        movie_indices = [i[0] for i in sim_scores if i[0] not in movie_indices]
        
        # Get the top N recommended movies
        movie_indices = movie_indices[:num_recommendations]
        
        # Return the top N movies
        recommendations = movies_df.iloc[movie_indices][['movieId', 'title', 'genres']]
        
        logger.info(f"Returning {len(recommendations)} recommendations")
        return recommendations
    except Exception as e:
        logger.error(f"Error in get_recommendations: {str(e)}")
        raise

def get_top_movies_by_genre(movies_df, genre, limit=50):
    """
    Get top movies for a specific genre
    """
    try:
        if not genre:
            # If no genre is selected, return some popular movies (using movieId as a proxy for popularity)
            return movies_df.sort_values('movieId').head(limit)[['movieId', 'title', 'genres']]
        
        # Filter movies by genre
        filtered_movies = movies_df[movies_df['genres'].str.contains(genre, na=False)]
        
        # Sort by movieId (as a simple proxy for popularity) and return top N
        return filtered_movies.sort_values('movieId').head(limit)[['movieId', 'title', 'genres']]
    except Exception as e:
        logger.error(f"Error in get_top_movies_by_genre: {str(e)}")
        # Return empty DataFrame in case of error
        return pd.DataFrame(columns=['movieId', 'title', 'genres'])