import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"; 
import Greninja from '/src/images/Home_fondo/fons_pokemon.png'; 
import { useTeams } from "../context/TeamsContext";
import { useFavorites } from "../context/FavoritesContext";

import './Home.css';

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [dailyPokemon, setDailyPokemon] = useState(null);
  const { teams } = useTeams();
  const { favorites } = useFavorites();


  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const storedDaily = JSON.parse(localStorage.getItem("dailyPokemon"));

    // 1. CARGA DE LA LISTA (OPTIMIZADA)
    fetch("https://pokeapi.co/api/v2/pokemon?limit=800")
      .then((res) => res.json())
      .then((data) => {
        // AQUÍ ESTÁ EL TRUCO: No hacemos fetch individual.
        // Construimos los datos con lo que ya tenemos.
        const optimizedList = data.results.map((p) => {
          // La url viene como "https://pokeapi.co/api/v2/pokemon/25/"
          // Cortamos el string para sacar el ID (25)
          const urlParts = p.url.split("/");
          const id = urlParts[urlParts.length - 2]; 

          return {
            id: parseInt(id),
            name: p.name,
            // Construimos la URL de la imagen manualmente sin llamar a la API
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          };
        });

        setPokemonList(optimizedList);

        // 2. LÓGICA DEL POKÉMON DEL DÍA
        // Si ya existe hoy, lo usamos
        if (storedDaily && storedDaily.date === today) {
          setDailyPokemon(storedDaily.pokemon);
        } else {
          // Si no, elegimos uno al azar de la lista optimizada
          const randomId = Math.floor(Math.random() * optimizedList.length);
          const chosenBasic = optimizedList[randomId];

          // Solo hacemos ESTE fetch extra para tener los detalles (tipos) del Pokémon del día
          fetch(`https://pokeapi.co/api/v2/pokemon/${chosenBasic.id}`)
            .then((res) => res.json())
            .then((details) => {
              const daily = {
                id: details.id,
                name: details.name,
                sprite: details.sprites.other["official-artwork"].front_default || details.sprites.front_default,
                types: details.types.map((t) => t.type.name),
              };
              
              setDailyPokemon(daily);
              localStorage.setItem(
                "dailyPokemon",
                JSON.stringify({ date: today, pokemon: daily })
              );
            });
        }
      })
      .catch((err) => console.error("Error cargando Pokemons:", err));
  }, []);

  // Lógica del filtrado (Se mantiene igual)
  const filteredList = useMemo(() => {
    if (!searchTerm) return [];
    return pokemonList.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pokemonList, searchTerm]);

  return (
  <div className="home-container">
    
    {/* 1. HERO IMAGE */}
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

      {/* LISTA DESPLEGABLE */}
      {searchTerm && filteredList.length > 0 && (
        <ul className="search-dropdown">
          {filteredList.slice(0, 8).map((p) => (
            <li key={p.id}>
              <Link to={`/PostDetail/${p.id}`} className="search-item-link">
                <img 
                  src={p.sprite} 
                  alt={p.name} 
                  className="search-item-img" 
                  loading="lazy" 
                />
                <div className="search-item-text">
                  <span className="search-name">{p.name}</span>
                  <span className="search-id">
                    #{String(p.id).padStart(4, '0')}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {searchTerm && filteredList.length === 0 && (
        <div className="search-dropdown empty">
          <p>No se encontraron resultados.</p>
        </div>
      )}
    </div>

    {/* POKÉMON DEL DÍA */}
    {dailyPokemon && (
      <div className="daily-container">
        <h2 className="daily-title">Pokémon del Día</h2>

        <Link to={`/PostDetail/${dailyPokemon.id}`} className="daily-card-link">
          <div className="daily-card">
            <div className="daily-info">
              <h3 className="daily-name">{dailyPokemon.name}</h3>
              <span className="daily-id">
                Nº {String(dailyPokemon.id).padStart(4, "0")}
              </span>

              <div className="daily-types">
                {dailyPokemon.types.map(type => (
                  <span key={type} className={`type-badge type-${type}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <img 
              src={dailyPokemon.sprite}
              alt={dailyPokemon.name}
              className="daily-img"
              loading="lazy"
            />
          </div>
        </Link>
      </div>
    )}

    <div className="daily-container">
      <div className="favorites-header-home">
         <h2 className="daily-title" style={{marginBottom:0}}>Mis Favoritos</h2>
         {favorites.length > 0 && (
             <Link to="/favorits" className="see-all-link">Ver todo</Link>
         )}
      </div>

      {favorites.length === 0 ? (
        // ESTADO VACÍO (Igual que FavoritesPage pero adaptado a Home)
        <div className="empty-fav-home">
           <p>No tienes favoritos aún.</p>
           <Link to="/PostList" className="empty-link-home">¡Busca en la Pokédex!</Link>
        </div>
      ) : (
        // GRID DE FAVORITOS 
        <div className="fav-home-grid">
           {favorites.slice(0, 3).map((poke) => {
              const imgUrl = poke.sprites?.other?.["official-artwork"]?.front_default 
                          || poke.sprites?.front_default 
                          || poke.sprite;
              
              return (
                <Link to={`/PostDetail/${poke.id}`} key={poke.id} className="fav-home-card">
                   <div className="fav-home-img-wrapper">
                      <img src={imgUrl} alt={poke.name} />
                   </div>
                   <span className="fav-home-name">{poke.name}</span>
                   <span className="fav-home-id">#{String(poke.id).padStart(4, '0')}</span>
                </Link>
              );
           })}
        </div>
      )}
    </div>

    {/* EQUIPOS */}
{teams.length > 0 && (
  <div className="daily-container">
    <h2 className="daily-title">Mis Equipos</h2>

    {/* CONTENEDOR PARA SEPARAR EQUIPOS */}
    <div className="teams-preview-list">
      {teams.map((team) => (
        <Link
          key={team.id}
          to="/Teams"
          className="daily-card-link"
        >
          <div className="daily-card">
            <div className="daily-info">
              <h3 className="daily-name">{team.name}</h3>
              <span className="daily-id">
                {team.slots.filter(Boolean).length} / 6 Pokémon
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 6
              }}
            >
              {team.slots.map((pokemon, index) => (
                <div key={index} style={{ width: 32, height: 32 }}>
                  {pokemon && (
                    <img
                      src={
                        pokemon.sprites?.versions?.["generation-viii"]?.icons?.front_default ||
                        pokemon.sprite
                      }
                      alt={pokemon.name}
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}

  </div>
);


}

export default Home;