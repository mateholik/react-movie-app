import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(
          `${API_BASE_URL}movie/${id}?append_to_response=credits`,
          API_OPTIONS
        );

        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>{error}</p>
          <Link to='/' className='text-blue-500 hover:underline'>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='mb-4'>Movie not found</p>
          <Link to='/' className='text-blue-500 hover:underline'>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className='min-h-screen text-white'>
      <div className='wrapper'>
        <nav className='mb-8'>
          <Link to='/' className='text-blue-500 hover:underline'>
            ← Back to Home
          </Link>
        </nav>

        <div className='movie-detail'>
          <div className='movie-detail-header grid md:grid-cols-2 gap-4'>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : '/no-movie.jpg'
              }
              alt={movie.title}
              className='movie-detail-poster'
            />

            <div className='movie-detail-info '>
              <h1 className='text-4xl font-bold mb-4 text-left leading-normal'>
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className='text-lg italic  mb-4'>{movie.tagline}</p>
              )}

              <div className='movie-meta mb-6'>
                <div className='flex items-center gap-4 mb-2'>
                  <div className='rating flex items-center'>
                    <img
                      src='/star.svg'
                      alt='star icon'
                      className='w-5 h-5 mr-1'
                    />
                    <span className='font-semibold'>
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  <span>·</span>
                  <span>
                    {movie.release_date
                      ? movie.release_date.split('-')[0]
                      : 'N/A'}
                  </span>
                  <span>·</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>

                <div className='genres mb-4'>
                  {movie.genres?.map((genre) => (
                    <span key={genre.id} className='genre-tag'>
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className='movie-overview mb-6'>
                <h2 className='text-2xl font-semibold mb-3'>Overview</h2>
                <p className='leading-relaxed'>
                  {movie.overview || 'No overview available.'}
                </p>
              </div>

              <div className='movie-details-grid'>
                <div>
                  <h3 className='font-semibold mb-1'>Status</h3>
                  <p>{movie.status || 'N/A'}</p>
                </div>
                <div>
                  <h3 className='font-semibold mb-1'>Original Language</h3>
                  <p>{movie.original_language?.toUpperCase() || 'N/A'}</p>
                </div>
                <div>
                  <h3 className='font-semibold mb-1'>Budget</h3>
                  <p>{formatCurrency(movie.budget)}</p>
                </div>
                <div>
                  <h3 className='font-semibold mb-1'>Revenue</h3>
                  <p>{formatCurrency(movie.revenue)}</p>
                </div>
              </div>
            </div>
          </div>

          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div className='cast-section mt-12'>
              <h2 className='text-2xl font-semibold mb-6'>Cast</h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {movie.credits.cast.slice(0, 12).map((actor) => (
                  <div key={actor.id} className='cast-member'>
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}`
                          : '/no-movie.jpg'
                      }
                      alt={actor.name}
                      className='cast-photo'
                    />
                    <div className='cast-info'>
                      <p className='font-semibold'>{actor.name}</p>
                      <p className='text-sm '>{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
