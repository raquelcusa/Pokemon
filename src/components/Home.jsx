import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"; 
import Greninja from '/src/images/Home_fondo/Greninja.png'; 
import './Home.css';

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [dailyPokemon, setDailyPokemon] = useState(null);

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
                  <span className="search-id">#{String(p.id).padStart(4, '0')}</span>
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
              loading="lazy"
            />
          </div>
        </Link>
      </div>
    )}
  </div>
);

}

export default Home;