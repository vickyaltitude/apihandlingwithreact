import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [isLoading,setIsLoading] = useState(false)
  const [movies,setMovies] = useState([])
 
  function getDataFromServer(){

    setIsLoading(true)

    setTimeout(async ()=>{
      const fetchData = await fetch("https://swapi.dev/api/films/");
      const parsed = await fetchData.json();
      let optimized = parsed.results.map(movies => {
          return {
            id: movies.episode_id,
            title: movies.title,
            releaseDate: movies.releaseDate,
            openingText: movies.opening_crawl
          }
      })
      setMovies(optimized)
      setIsLoading(false)
    },2000)
   

  }
  return (
    <React.Fragment>
      <section>
      <button onClick={getDataFromServer}>Fetch Movies</button>
      </section>
      <section>
      {isLoading && <p>Content Loading Please Wait...</p>} 
      {!isLoading && <MoviesList movies={movies} />}
        
      </section>
    </React.Fragment>
  );
}

export default App;
