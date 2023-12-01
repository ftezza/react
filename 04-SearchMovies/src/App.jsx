import './App.css'
import { useMovies } from './hooks/useMovies';
import { Movies } from './components/movies'
import { useCallback, useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import debounce from 'just-debounce-it';
//API Key: 86494b69

function useSearch() {
  const [error, setError] = useState(null)
  const [search, updateSearch] = useState('')
  const isFirstInput = useRef(true)

  useEffect(() => {
    //Evitar validacion al inicio del render
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }

    if (search === '') {
      setError('Debe completar un titulo para realizar la busqueda')
      return
    }
    if (search.length < 3) {
      setError('El titulo debe contener 3 caracteres o mas para realizar la busqueda')
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }
}


function App() {
  const [sort, setSort] = useState(false)
  const { search, updateSearch, error } = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort });


  /*
    Utilizamos un debounce para el realizar las peticiones en el tipe del input
    para realizar peticiones antes el cambio del search una vez pasado los 500ms de no tipear nada.
  */
  const debounceGetMovies = useCallback(
    debounce(search => {
      console.log('search:', search)
      getMovies({ search })
    }, 500)
    , [getMovies])

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debounceGetMovies(newSearch)
  }

  const handleSort = () => {
    setSort(!sort)
  }


  return (

    <div className='page'>
      <header>
        <h1>Buscador de peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input onChange={handleChange} value={search} name='query' placeholder='Avengers, matrix....'></input>
          <input type='checkbox' onChange={handleSort} checked={sort}></input>
          <button type='submit'>Search</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App
