import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFavorites } from '../context/FavoritesContext';
import "./PostDetail.css";

import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg';
import ICONO_POKEDEX from '../images/icono_pokedex/POKEDEX.png';
import HEARTEMPTY from '/src/images/iconos_favorito_detalles/HEARTEMPTY.svg';
import HEARTFULL from '/src/images/iconos_favorito_detalles/HEARTFULL.svg';

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
 
  const { toggleFavorite, isFavorite } = useFavorites();
 
 if (loading || !pokemon || !species) return <div className="loading">Cargando...</div>;

  // --- Processament de dades ---
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
      
      {/* Capçalera */}
      <header className="detail-header">
        <Link to="/" className="back-icon">
          <img src={ICONO_ATRAS} alt="Volver"/>
        </Link>

        {/* -- Afegir pokémon a favorits -- */}
        <button 
            onClick={() => toggleFavorite(pokemon)}    
            style={{ 
              background: 'transparent', 
              border: 'none',            
                  }}
        >
            {isFavorite(pokemon.id) ?  <img src={HEARTFULL} alt="Favorito" className="fav-icon" />: <img src={HEARTEMPTY} alt="Favorito" className="fav-icon" />}
        </button>

      </header>

      {/* Imatge Gran */}
      <div className="image-wrapper">
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="main-pokemon-img"
        />
      </div>

      {/* Targeta de Dades */}
      <div className="detail-card-panel">
        
        {/* Títol i ID */}
        <div className="title-section">
          <h1 className="pokemon-name-detail">{pokemon.name}</h1>
          
          {/* Icona Pokédex + Número */}
          <div className="id-container">
            <img src={ICONO_POKEDEX} alt="Pokedex" className="pokedex-icon" />
            <span className="pokemon-id-detail">Nº {String(pokemon.id).padStart(4, '0')}</span>
          </div>
        </div>

        {/* Tipus (Alineats a l'esquerra) */}
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

        {/* Descripció */}
        <p className="pokemon-description">
          {description}
        </p>

        {/* Grid d'Estadístiques */}
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