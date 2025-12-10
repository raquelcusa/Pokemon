import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"; 
import Greninja from '/src/images/Home_fondo/Greninja.png'; 
import './Home.css';

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonList, setPokemonList] = useState([]);

  // 1. Cargar la lista completa para que el buscador tenga datos
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=800")
      .then((res) => res.json())
      .then((data) => {
        return Promise.all(
          data.results.map((p) =>
            fetch(p.url)
              .then((res) => res.json())
              .then((details) => ({
                id: details.id,
                name: details.name,
                sprite: details.sprites.versions["generation-viii"].icons.front_default || details.sprites.front_default,
              }))
          )
        );
      })
      .then((fullList) => setPokemonList(fullList))
      .catch((err) => console.error(err));
  }, []);

  // 2. Lógica del filtrado
  const filteredList = useMemo(() => {
    if (!searchTerm) return [];
    return pokemonList.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pokemonList, searchTerm]);

  return (
    <div className="home-container">
      
      {/* 1. HERO IMAGE (Foto de arriba) */}
      <div 
        className="home-hero"
        style={{ backgroundImage: `url(${Greninja})` }}
      ></div>

      {/* 2. TARJETA NEGRA (Buscador) */}
      <div className="search-card-dark">
        <h2 className="home-title">
          Explora el <br /> Mundo Pokémon !
        </h2>

        <div className="search-input-wrapper">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Buscar Pokémon..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* LISTA DESPLEGABLE (Solo aparece si escribes) */}
        {searchTerm && filteredList.length > 0 && (
          <ul className="search-dropdown">
            {filteredList.slice(0, 8).map((p) => (
              <li key={p.id}>
                <Link to={`/PostDetail/${p.id}`} className="search-item-link">
                  <img src={p.sprite} alt={p.name} className="search-item-img" />
                  <div className="search-item-text">
                    <span className="search-name">{p.name}</span>
                    <span className="search-id">#{String(p.id).padStart(4, '0')}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Mensaje opcional si no encuentra nada */}
        {searchTerm && filteredList.length === 0 && (
            <div className="search-dropdown empty">
                <p>No se encontraron resultados.</p>
            </div>
        )}
      </div>

    </div>
  );
}

export default Home;