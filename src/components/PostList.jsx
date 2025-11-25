import { useState, useEffect } from "react";
import "./PostList.css";

function PostList() {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=200")
      .then((res) => res.json())
      .then((data) => {
        return Promise.all(
          data.results.map((p) =>
            fetch(p.url)
              .then((res) => res.json())
              .then((details) => ({
                id: details.id,
                name: details.name,
                sprite:
                  details.sprites.versions["generation-viii"].icons
                    .front_default,
                types: details.types.map((t) => t.type.name), // array of 1 or 2 types
              }))
          )
        );
      })
      .then((fullList) => setPokemonList(fullList))
      .catch((err) => console.error(err));
  }, []);


    return (
    <div className="pokedex-container">
      {/* Capçalera i Títol */}
      <header className="header">
        <button className="back-button">‹</button>
        <h1 className="title">Pokédex</h1>
      </header>

      {/* Buscador */}
      <div className="search-wrapper">
        <input type="text" className="search-bar" placeholder="Buscar" />
      </div>

      {/* Filtres */}
      <div className="filters">
        <button className="filter-btn">Tipos <span>▼</span></button>
        <button className="filter-btn">Ordenar por <span>▼</span></button>
      </div>

      {/* Grid de Pokémons (Substitueix el ul/li) */}
      <div className="pokemon-grid">
        {pokemonList.map((p) => (
          <div key={p.id} className="pokemon-card">
            
            <div className="card-image-container">
              <img src={p.sprite} alt={p.name} className="pokemon-img" />
            </div>

            <div className="card-footer">
              {/* Format per posar zeros a l'esquerra (ex: 001) */}
              <span className="pokemon-id">Nº {String(p.id).padStart(4, '0')}</span>
              <span className="pokemon-name">{p.name}</span>
              
             
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );

  
}

export default PostList;