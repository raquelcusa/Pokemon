import { createContext, useState, useContext } from 'react';

// 1. Creem el Context (el "tub")
const FavoritesContext = createContext();

// 2. Creem el Provider (el component que "injecta" les dades)
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Funció per afegir/treure (toggle)
  const toggleFavorite = (pokemon) => {
    // Comprovem si ja existeix
    const exists = favorites.find(fav => fav.id === pokemon.id);
    
    if (exists) {
      // Si existeix, el treiem (filtre tots menys aquest)
      setFavorites(favorites.filter(fav => fav.id !== pokemon.id));
    } else {
      // Si no existeix, l'afegim
      setFavorites([...favorites, pokemon]);
    }
  };

  // Funció per saber si és favorit (per pintar el cor ple o buit)
  const isFavorite = (id) => {
    return favorites.some(fav => fav.id === id);
  };

  // 3. Retornem el Provider amb els valors que volem compartir
  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// 4. Hook personalitzat per consumir-ho fàcil (Opcional, però recomanat)
export const useFavorites = () => useContext(FavoritesContext);