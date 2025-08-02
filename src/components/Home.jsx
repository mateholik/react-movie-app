import { useState, useEffect } from 'react';
import Search from './Search';
import Spinner from './Spinner';
import MovieCard from './MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMoves } from '../appwrite';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debauncedSearchTerm, setDebauncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebauncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage(`Error fetching movies. Please try again later`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMoves();
      setTrendingMovies(movies.documents);
    } catch (error) {
      console.log(`error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debauncedSearchTerm);
  }, [debauncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <div>
      <header>
        <img src='./hero.png' alt='Hero banner' width='512' height='477' />
        <h1>
          <span className='text-gradient'>Find Movies</span> That You Enjoy With
          Out the Hassle
        </h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>

      <div className='min-h-screen'>
        {isLoading ? (
          <div className='flex justify-center mt-8'>
            <Spinner />
          </div>
        ) : errorMessage ? (
          <p className='text-red-500'>{errorMessage}</p>
        ) : (
          <div>
            {trendingMovies.length > 0 && (
              <section className='trending'>
                <h2>Trending movies</h2>
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <Link
                        to={`/movie/${movie.movie_id}`}
                        className='trending-movie-link'
                      >
                        <p>{index + 1}</p>
                        <img src={movie.poster_url} alt={movie.searchTerm} />
                      </Link>
                      {/* <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} /> */}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {movieList.length > 0 && (
              <section className='all-movies'>
                <h2>All movies</h2>
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
