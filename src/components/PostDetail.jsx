import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./PostDetail.css";
// Ajusta estas rutas si es necesario según tu estructura exacta de carpetas
import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg';
import ICONO_POKEDEX from '../images/icono_pokedex/POKEDEX.png';

const TYPE_COLORS = {
  grass: "#3FA129",
  fire: "#E62829",
  water: "#2980EF",
  bug: "#91A119",
  normal: "#9FA19F",
  poison: "#8F41CB",
  electric: "#FAC000",
  ground: "#915121",
  fairy: "#EF71EF",
  fighting: "#FF8000",
  psychic: "#EF4179",
  rock: "#AFA981",
  ghost: "#704170",
  ice: "#3FD8FF",
  dragon: "#5061E1",
  flying: "#81B9EF",
  steel: "#60A1B8",
  dark: "#50413F",
};

function PostDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Datos básicos
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonData = await pokemonRes.json();
        setPokemon(pokemonData);

        // 2. Datos de la especie
        const speciesRes = await fetch(pokemonData.species.url);
        const speciesData = await speciesRes.json();
        setSpecies(speciesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !pokemon || !species) return <div className="loading">Cargando...</div>;

  // --- Procesamiento de datos ---
  const descriptionEntry = species.flavor_text_entries.find((e) => e.language.name === "es");
  const description = descriptionEntry 
    ? descriptionEntry.flavor_text.replace(/[\n\f]/g, " ") 
    : "Sin descripción disponible.";

  const genusEntry = species.genera.find((g) => g.language.name === "es");
  const category = genusEntry ? genusEntry.genus.replace("Pokémon ", "") : "Desconocido";

  const ability = pokemon.abilities[0]?.ability.name;
  const mainType = pokemon.types[0].type.name;
  const backgroundColor = TYPE_COLORS[mainType] || "#9FA19F";

  return (
    <div className="detail-container" style={{ backgroundColor: backgroundColor }}>
      
      {/* Cabecera */}
      <header className="detail-header">
        <Link to="/" className="back-btn">
          <img src={ICONO_ATRAS} alt="Volver" className="back-icon" />
        </Link>
      </header>

      {/* Imagen Grande */}
      <div className="image-wrapper">
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="main-pokemon-img"
        />
      </div>

      {/* Tarjeta de Datos */}
      <div className="detail-card-panel">
        
        {/* Título e ID */}
        <div className="title-section">
          <h1 className="pokemon-name-detail">{pokemon.name}</h1>
          
          {/* Icono Pokédex + Número */}
          <div className="id-container">
            <img src={ICONO_POKEDEX} alt="Pokedex" className="pokedex-icon" />
            <span className="pokemon-id-detail">Nº {String(pokemon.id).padStart(4, '0')}</span>
          </div>
        </div>

        {/* Tipos (Alineados izquierda) */}
        <div className="types-container">
          {pokemon.types.map((t) => (
            <span 
              key={t.type.name} 
              className="type-pill"
              style={{ backgroundColor: TYPE_COLORS[t.type.name] || '#9FA19F' }}
            >
              {t.type.name}
            </span>
          ))}
        </div>

        {/* Descripción */}
        <p className="pokemon-description">
          {description}
        </p>

        {/* Grid de Estadísticas */}
        <div className="stats-grid">
          
          <div className="stat-box">
            <span className="stat-label">PESO</span>
            <div className="stat-value-pill">
              {pokemon.weight / 10} kg
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-label">ALTURA</span>
            <div className="stat-value-pill">
              {pokemon.height / 10} m
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-label">CATEGORÍA</span>
            <div className="stat-value-pill">
              {category}
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-label">HABILIDAD</span>
            <div className="stat-value-pill capitalize">
              {ability}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}

export default PostDetail;