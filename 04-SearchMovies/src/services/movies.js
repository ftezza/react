const API_KEY = '86494b69'
export const searchMovies = async ({ search }) => {
    if (search === '') return null

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`)
        const json = await response.json()

        const movies = json.Search


        /*Mapeo de datos centralizados para evitar 
        el retrabajo ante un cambio de las propiedades en la api*/
        return movies?.map(movie => ({
            id: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            poster: movie.Poster

        }))
    }
    catch (e){
        throw new Error('error');
    }
}