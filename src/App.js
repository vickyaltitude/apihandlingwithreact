import React, { useState, useEffect,useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [isError, setIsError] = useState(null);


  const getDataFromServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchData = await fetch("https://console.firebase.google.com/u/0/project/reactsampleapi-1d96c/database/reactsampleapi-1d96c-default-rtdb/data/~2F");
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
  },[]);

  useEffect(()=>{
    
          getDataFromServer()
  },[getDataFromServer])
  
 function handleLoading(){
  setIsError(null)
  
 }

 function addMovieHandler(){

 }
  return (
    <React.Fragment>
    <section>
      <AddMovie onAddMovie={addMovieHandler}/>
    </section>
      <section>
        <button onClick={getDataFromServer}>Fetch Movies</button>
      </section>
      <section>
        {isLoading  && <p>Content Loading Please Wait...</p>}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && !isError && movies.length === 0 && <>No Movies To Show</>}
        {!isLoading && isError && (
          <>
            <p>Something went wrong. Please wait, we are re-trying...</p>
            <button onClick={handleLoading}>Cancel Retrying</button>
          </>
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
