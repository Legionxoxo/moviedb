const axios = require("axios");
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY; // Store API keys in .env file

// Function to fetch metadata from TMDb
async function getMovieMetadata(title, year) {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie`,
            {
                params: {
                    api_key: TMDB_API_KEY,
                    query: title,
                    year: year,
                },
            }
        );

        const movie = response.data.results[0]; // Get the first search result
        if (!movie) {
            throw new Error("Movie not found");
        }

        // Fetch additional movie details using movie ID
        const detailsResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            {
                params: {
                    api_key: TMDB_API_KEY,
                },
            }
        );

        const movieDetails = detailsResponse.data;

        // Return relevant details
        return {
            title: movieDetails.title,
            year: movieDetails.release_date.split("-")[0],
            plot: movieDetails.overview,
            rating: movieDetails.vote_average,
            genres: movieDetails.genres.map((g) => g.name),
            cast: await getCast(movie.id),
            poster: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
        };
    } catch (error) {
        console.error(`Error fetching movie metadata: ${error.message}`);
    }
}

// Function to get movie cast details from TMDb
async function getCast(movieId) {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}/credits`,
            {
                params: {
                    api_key: TMDB_API_KEY,
                },
            }
        );

        const cast = response.data.cast.slice(0, 5); // Return top 5 cast members
        return cast.map((member) => member.name);
    } catch (error) {
        console.error(`Error fetching cast: ${error.message}`);
    }
}

// Usage
getMovieMetadata("Inception", 2010).then((metadata) => console.log(metadata));
