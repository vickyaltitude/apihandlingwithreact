import React, { useState, useEffect } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [isError, setIsError] = useState(null);
  const [retrying, setRetrying] = useState(false);


  const getDataFromServer = async () => {
    setIsLoading(true);
    try {
      const fetchData = await fetch("https://swapi.dev/api/films/");
      if (!fetchData.ok) {
        throw new Error('Something went wrong');
      }
      const parsed = await fetchData.json();
      let optimized = parsed.results.map(movie => {
        return {
          id: movie.episode_id,
          title: movie.title,
          releaseDate: movie.release_date,
          openingText: movie.opening_crawl,
        };
      });
      setMovies(optimized);
      setIsError(null); 
    } catch (error) {
      setIsError(error.message);
    }
    setIsLoading(false);
  };

  
  useEffect(() => {
   
    getDataFromServer();

    let retryInterval;

    if (isError && !retrying) {
      retryInterval = setInterval(() => {
        getDataFromServer(); 
      }, 1000);
      setRetrying(true); 

      return () => {
        clearInterval(retryInterval);
        setRetrying(false);
      };
    }

    return () => {
      if (retryInterval) {
        clearInterval(retryInterval); 
      }
    };
  }, [isError, retrying]);

  // Cancel retrying logic
  const cancelRetry = () => {
    setIsError(null); 
    setRetrying(false); 
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={getDataFromServer}>Fetch Movies</button>
      </section>
      <section>
        {isLoading && <p>Content Loading Please Wait...</p>}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && !isError && movies.length === 0 && <>No Movies To Show</>}
        {!isLoading && isError && (
          <>
            <p>Something went wrong. Please wait, we are re-trying...</p>
            <button onClick={cancelRetry}>Cancel Retrying</button>
          </>
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
