import { useCallback, useMemo, useRef, useState } from 'react'
import { searchMovies } from '../services/movies';

export function useMovies({ search, sort }) {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const previousSearch = useRef(search)



    /*
    Se utiliza useCallback para las dependencias de 
    funciones en lugar de useMemo
    */
    const getMovies = useCallback(async ({search}) => {
            try {
                if (search === previousSearch.current) return
                setLoading(true)
                setError(null)
                previousSearch.current = search
                const newMovies = await searchMovies({ search })
                setMovies(newMovies)
            }
            catch (e) {
                setError(e.message)
            }
            finally {
                setLoading(false)
            }
        }
    ,[])


    /* 
        Utilizamos el hook useMemo, para determinar las dependencias que deben
        cambiar para que se realice la logica de ordenamiento nuevamente.
    */
    const sortedMovies = useMemo(() => {
        console.log('memo sorted movies')
        return sort
            ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
            : movies
    }, [sort, movies])

    // const sortedMovies = sort 
    // ? [...movies].sort((a, b)=> a.title.localeCompare(b.title))
    // : movies

    return { movies: sortedMovies, getMovies, loading }
}