import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"; 
import Greninja from '/src/images/Home_fondo/Greninja.png'; 
import './Home.css';

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [dailyPokemon, setDailyPokemon] = useState(null);

  // 1. Cargar la lista completa para que el buscador tenga datos + Pokémon del Día
useEffect(() => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const storedDaily = JSON.parse(localStorage.getItem("dailyPokemon"));

  // Si ya hay Pokémon del día para hoy, lo usamos
  if (storedDaily && storedDaily.date === today) {
    setDailyPokemon(storedDaily.pokemon);
  }

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
              sprite:
                details.sprites.versions["generation-viii"].icons.front_default ||
                details.sprites.front_default,
            }))
        )
      ).then((fullList) => {
        setPokemonList(fullList);

        // Si no hay Pokémon del día para hoy, elegimos uno nuevo
        if (!storedDaily || storedDaily.date !== today) {
          const randomId = Math.floor(Math.random() * fullList.length);
          const chosen = fullList[randomId];

          fetch(`https://pokeapi.co/api/v2/pokemon/${chosen.id}`)
            .then((res) => res.json())
            .then((details) => {
              const daily = {
                id: details.id,
                name: details.name,
                sprite:
                  details.sprites.other["official-artwork"].front_default ||
                  details.sprites.front_default,
                types: details.types.map((t) => t.type.name),
              };
              setDailyPokemon(daily);
              localStorage.setItem(
                "dailyPokemon",
                JSON.stringify({ date: today, pokemon: daily })
              );
            });
        }
      });
    })
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
 
  {/* NUEVO: POKÉMON DEL DÍA */}
{dailyPokemon && (
  <div className="daily-container">
    <h2 className="daily-title">Pokémon del Día</h2>

    <Link to={`/PostDetail/${dailyPokemon.id}`} className="daily-card-link">
      <div className="daily-card">
        <div className="daily-info">
          <h3 className="daily-name">{dailyPokemon.name}</h3>
          <span className="daily-id">Nº {String(dailyPokemon.id).padStart(4, "0")}</span>

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
        />
      </div>
    </Link>
  </div>
)}

    </div>
  );
}

export default Home;
