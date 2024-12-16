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
      const fetchData = await fetch("https://crudcrud.com/api/cd059c1c532b4aaa8008509a48d4ebbf/movies");
      
      if (!fetchData.ok) {
        throw new Error('Something went wrong');
      }
      const parsed = await fetchData.json();
      console.log(parsed)
      let optimized = parsed.map(movie => {
        return {
          id: movie._id,
          title: movie.title,
          releaseDate: movie.releaseDate,
          openingText: movie.openingText,
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

 async function addMovieHandler(movies){

     const sendData = await fetch('https://crudcrud.com/api/cd059c1c532b4aaa8008509a48d4ebbf/movies',{
      method: 'POST',
      body: JSON.stringify(movies),
      headers:{
        "Content-Type": 'application/json'
      }
     });
     const parsed = await sendData.json();
     console.log(parsed)

 }

 async function deleteMovie(id){
  console.log(id)
  const fetchData = await fetch(`https://crudcrud.com/api/cd059c1c532b4aaa8008509a48d4ebbf/movies/${id}`,{
    method: 'DELETE'
  });
  if(fetchData.status){
    getDataFromServer()
  }
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
        {!isLoading && movies.length > 0 && <MoviesList handleDeleteMovie={deleteMovie} movies={movies} />}
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
