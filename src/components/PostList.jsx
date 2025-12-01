import { useState, useEffect } from "react";
import "./PostList.css";
import{ Link} from "react-router-dom";
import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg'

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
           <header className="detail-header">
             <Link to="/" className="back-btn">
               <img src={ICONO_ATRAS} alt="Volver" className="back-icon2" />
             </Link>
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
          <Link to={`/PostDetail/${p.id}`} key={p.id} className="pokemon-card-link">
          <div className="pokemon-card">
            <div className="card-image-container">
              <img src={p.sprite} alt={p.name} className="pokemon-img" />
            </div>

            <div className="card-footer">
              <span className="pokemon-id">Nº {String(p.id).padStart(4, '0')}</span>
              <span className="pokemon-name">{p.name}</span>
            </div>
          </div>
        </Link>
          
        ))}
      </div>
    </div>
  );


}

export default PostList;