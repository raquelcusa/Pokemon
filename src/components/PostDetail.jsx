import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useFavorites } from '../context/FavoritesContext';
import "./PostDetail.css";

import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg';
import ICONO_POKEDEX from '../images/icono_pokedex/POKEDEX.png';
import HEARTEMPTY from '/src/images/iconos_favorito_detalles/HEARTEMPTY.svg';
import HEARTFULL from '/src/images/iconos_favorito_detalles/HEARTFULL.svg';

/* -- IMPORTACIÓ D'ICONES DE TIPUS -- */
import Tipo_acero_icono_EP from '/src/images/icono_tipos/Tipo_acero_icono_EP.svg';
import Tipo_agua_icono_EP from '/src/images/icono_tipos/Tipo_agua_icono_EP.svg';
import Tipo_bicho_icono_EP from '/src/images/icono_tipos/Tipo_bicho_icono_EP.svg';
import Tipo_dragón_icono_EP from '/src/images/icono_tipos/Tipo_dragón_icono_EP.svg';
import Tipo_eléctrico_icono_EP from '/src/images/icono_tipos/Tipo_eléctrico_icono_EP.svg';
import Tipo_fantasma_icono_EP from '/src/images/icono_tipos/Tipo_fantasma_icono_EP.svg';
import Tipo_fuego_icono_EP from '/src/images/icono_tipos/Tipo_fuego_icono_EP.svg';
import Tipo_hada_icono_EP from '/src/images/icono_tipos/Tipo_hada_icono_EP.svg';
import Tipo_hielo_icono_EP from '/src/images/icono_tipos/Tipo_hielo_icono_EP.svg';
import Tipo_lucha_icono_EP from '/src/images/icono_tipos/Tipo_lucha_icono_EP.svg';
import Tipo_normal_icono_EP from '/src/images/icono_tipos/Tipo_normal_icono_EP.svg';
import Tipo_planta_icono_EP from '/src/images/icono_tipos/Tipo_planta_icono_EP.svg';
import Tipo_psíquico_icono_EP from '/src/images/icono_tipos/Tipo_psíquico_icono_EP.svg';
import Tipo_roca_icono_EP from '/src/images/icono_tipos/Tipo_roca_icono_EP.svg';
import Tipo_siniestro_icono_EP from '/src/images/icono_tipos/Tipo_siniestro_icono_EP.svg';
import Tipo_tierra_icono_EP from '/src/images/icono_tipos/Tipo_tierra_icono_EP.svg';
import Tipo_veneno_icono_EP from '/src/images/icono_tipos/Tipo_veneno_icono_EP.svg';
import Tipo_volador_icono_EP from '/src/images/icono_tipos/Tipo_volador_icono_EP.svg';

// Mapeo d'icones
const TYPE_ICONS = {
  steel: Tipo_acero_icono_EP,
  water: Tipo_agua_icono_EP,
  bug: Tipo_bicho_icono_EP,
  dragon: Tipo_dragón_icono_EP,
  electric: Tipo_eléctrico_icono_EP,
  ghost: Tipo_fantasma_icono_EP,
  fire: Tipo_fuego_icono_EP,
  fairy: Tipo_hada_icono_EP,
  ice: Tipo_hielo_icono_EP,
  fighting: Tipo_lucha_icono_EP,
  normal: Tipo_normal_icono_EP,
  grass: Tipo_planta_icono_EP,
  psychic: Tipo_psíquico_icono_EP,
  rock: Tipo_roca_icono_EP,
  dark: Tipo_siniestro_icono_EP,
  ground: Tipo_tierra_icono_EP,
  poison: Tipo_veneno_icono_EP,
  flying: Tipo_volador_icono_EP,
};

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

const STAT_NAMES = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed"
};

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutions, setEvolutions] = useState([]); 
  // Estado nuevo para guardar debilidades y fortalezas
  const [typeRelations, setTypeRelations] = useState({ weaknesses: [], strengths: [] });
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Dades bàsics
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonData = await pokemonRes.json();
        setPokemon(pokemonData);

        // 2. Dades de la especie
        const speciesRes = await fetch(pokemonData.species.url);
        const speciesData = await speciesRes.json();
        setSpecies(speciesData);

        // 3. Dades de Relacions de Tipus (Debilidades y Fortalezas)
        // Obtenemos la info detallada de cada tipo que tiene el pokemon
        const typeUrls = pokemonData.types.map(t => t.type.url);
        const typeResponses = await Promise.all(typeUrls.map(url => fetch(url).then(res => res.json())));

        // --- CÁLCULO DE DEBILIDADES (Defensivo) ---
        // Inicializamos todos los tipos con multiplicador 1
        const damageMap = {};
        const allTypes = Object.keys(TYPE_ICONS);
        allTypes.forEach(t => damageMap[t] = 1);

        typeResponses.forEach(typeData => {
            // double_damage_from -> El pokemon recibe x2
            typeData.damage_relations.double_damage_from.forEach(t => {
                if(damageMap[t.name]) damageMap[t.name] *= 2;
            });
            // half_damage_from -> El pokemon recibe x0.5
            typeData.damage_relations.half_damage_from.forEach(t => {
                if(damageMap[t.name]) damageMap[t.name] *= 0.5;
            });
            // no_damage_from -> El pokemon recibe x0 (inmune)
            typeData.damage_relations.no_damage_from.forEach(t => {
                if(damageMap[t.name]) damageMap[t.name] *= 0;
            });
        });
        // Filtramos los que tengan multiplicador > 1 (son debilidades reales)
        const weakTo = Object.keys(damageMap).filter(t => damageMap[t] > 1);

        // --- CÁLCULO DE FORTALEZAS (Ofensivo) ---
        // Contra qué tipos pega fuerte este pokemon (unimos los arrays double_damage_to)
        const strongSet = new Set();
        typeResponses.forEach(typeData => {
            typeData.damage_relations.double_damage_to.forEach(t => strongSet.add(t.name));
        });
        const strongAgainst = Array.from(strongSet);

        setTypeRelations({ weaknesses: weakTo, strengths: strongAgainst });

        // 4. Dades de Evolució
        const evoChainRes = await fetch(speciesData.evolution_chain.url);
        const evoChainData = await evoChainRes.json();
        
        const evoList = getEvoChain(evoChainData.chain);
        
        const evoDetailsPromises = evoList.map(name => 
            fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json())
        );
        const evoDetails = await Promise.all(evoDetailsPromises);
        setEvolutions(evoDetails);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getEvoChain = (chain) => {
    let evos = [];
    evos.push(chain.species.name); 
    if (chain.evolves_to && chain.evolves_to.length > 0) {
        chain.evolves_to.forEach(subChain => {
            evos = evos.concat(getEvoChain(subChain));
        });
    }
    return evos;
  };
 
 if (loading || !pokemon || !species) return <div className="loading">Cargando...</div>;

  const descriptionEntry = species.flavor_text_entries.find((e) => e.language.name === "es");
  const description = descriptionEntry 
    ? descriptionEntry.flavor_text.replace(/[\n\f]/g, " ") 
    : "Sin descripción disponible.";

  const genusEntry = species.genera.find((g) => g.language.name === "es");
  const category = genusEntry ? genusEntry.genus.replace("Pokémon ", "") : "Desconocido";

  const ability = pokemon.abilities[0]?.ability.name;
  const mainType = pokemon.types[0].type.name;
  const backgroundColor = TYPE_COLORS[mainType] || "#9FA19F";

  const genderRate = species.gender_rate;
  let genderless = genderRate === -1;
  let femaleRate = genderless ? 0 : (genderRate / 8) * 100;
  let maleRate = genderless ? 0 : 100 - femaleRate;

  const totalStats = pokemon.stats.reduce((acc, curr) => acc + curr.base_stat, 0);
  const maxStatValue = 255; 

  return (
    <div className="detail-container" style={{ backgroundColor: backgroundColor }}>
      
      {/* HEADER */}
      <header className="detail-header">
        {/* Botón Atrás (Izquierda) */}
        <button 
            onClick={() => navigate(-1)} 
            className="header-btn" 
        >
          <img src={ICONO_ATRAS} alt="Volver" className="back-icon" />
        </button>

        {/* Botón Favorito (Derecha) */}
        <button 
            onClick={() => toggleFavorite(pokemon)}    
            className="header-btn"
        >
            {isFavorite(pokemon.id) ?  
                <img src={HEARTFULL} alt="Favorito" className="fav-icon" /> : 
                <img src={HEARTEMPTY} alt="Favorito" className="fav-icon" />
            }
        </button>
      </header>

      {/* IMATGE */}
      <div className="image-wrapper">
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="main-pokemon-img"
        />
      </div>

      {/* --- TARGETA 1: INFO GENERAL --- */}
      <div className="detail-card-panel main-panel">
        <div className="title-section">
          <h1 className="pokemon-name-detail">{pokemon.name}</h1>
          <div className="id-container">
            <img src={ICONO_POKEDEX} alt="Pokedex" className="pokedex-icon" />
            <span className="pokemon-id-detail">Nº {String(pokemon.id).padStart(4, '0')}</span>
          </div>
        </div>

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

        <p className="pokemon-description">{description}</p>

        <div className="stats-grid">
          {/* CASILLA 1: DEBILIDADES (Sustituye a Peso) */}
          <div className="stat-box">
            <span className="stat-label">DEBILIDADES</span>
            <div className="stat-value-pill" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', padding: '5px', maxWidth: '94%' }}>
                {typeRelations.weaknesses.length > 0 ? (
                    typeRelations.weaknesses.map(typeName => (
                        TYPE_ICONS[typeName] && (
                            <img 
                                key={typeName} 
                                src={TYPE_ICONS[typeName]} 
                                alt={typeName} 
                                title={typeName}
                                style={{ width: '30px', height: '30px', flexWrap: 'wrap' }} 
                            />
                        )
                    ))
                ) : (
                    <span style={{ fontSize: '0.8rem' }}>Ninguna</span>
                )}
            </div>
          </div>

          {/* CASILLA 2: FORTALEZAS (Sustituye a Altura) */}
          <div className="stat-box">
            <span className="stat-label">EFICAZ CONTRA</span>
            <div className="stat-value-pill" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', padding: '5px' , maxWidth: '94%' }}>
                {typeRelations.strengths.length > 0 ? (
                    typeRelations.strengths.map(typeName => (
                        TYPE_ICONS[typeName] && (
                            <img 
                                key={typeName} 
                                src={TYPE_ICONS[typeName]} 
                                alt={typeName}
                                title={typeName}
                                style={{ width: '30px', height: '30px' , flexWrap: 'wrap' }} 
                            />
                        )
                    ))
                ) : (
                    <span style={{ fontSize: '0.8rem' }}>Ninguno</span>
                )}
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-label">CATEGORÍA</span>
            <div className="stat-value-pill">{category}</div>
          </div>
          <div className="stat-box">
            <span className="stat-label">HABILIDAD</span>
            <div className="stat-value-pill capitalize">{ability}</div>
          </div>
        </div>

        <div className="gender-container">
            <span className="gender-title">SEXO</span>
            {genderless ? (
                 <div className="gender-bar-container">
                    <div className="gender-bar-full" style={{background: '#ccc'}}></div>
                    <span className="gender-text-center">Sin género</span>
                 </div>
            ) : (
                <>
                    <div className="gender-bar-container">
                        <div className="gender-part male" style={{ width: `${maleRate}%` }}></div>
                        <div className="gender-part female" style={{ width: `${femaleRate}%` }}></div>
                    </div>
                    <div className="gender-info">
                        <div className="gender-item male-text">
                            <span className="gender-symbol">♂</span> <span>{maleRate}%</span>
                        </div>
                        <div className="gender-item female-text">
                            <span>{femaleRate}%</span> <span className="gender-symbol">♀</span> 
                        </div>
                    </div>
                </>
            )}
        </div>
      </div>

      {/* --- TARGETA 2: SKILLS --- */}
      <div className="detail-card-panel skills-panel">
        <h3 className="skills-title">Skills</h3>
        
        <div className="skills-list">
            {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="skill-row">
                    <span className="skill-name">{STAT_NAMES[stat.stat.name] || stat.stat.name}</span>
                    <span className="skill-value">{String(stat.base_stat).padStart(3, '0')}</span>
                    
                    <div className="skill-bar-bg">
                        <div 
                            className="skill-bar-fill" 
                            style={{ width: `${(stat.base_stat / maxStatValue) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
            
            <div className="skill-row total-row">
                <span className="skill-name">Total</span>
                <span className="skill-value">{totalStats}</span>
                <div className="skill-bar-bg transparent-bar"></div> 
            </div>
        </div>
      </div>

      {/* --- TARGETA 3: EVOLUCIÓ (AMB ICONES) --- */}
      {evolutions.length > 0 && (
          <div className="detail-card-panel evolution-panel">
            <h3 className="skills-title">Evolución</h3>
            
            <div className="evolution-list">
                {evolutions.map((evo) => (
                    <Link to={`/PostDetail/${evo.id}`} key={evo.id} className="evo-item-link">
                        <div className="evo-item">
                            <div className="evo-img-circle">
                                <img 
                                    src={evo.sprites.other["official-artwork"].front_default || evo.sprites.front_default} 
                                    alt={evo.name} 
                                    className="evo-img"
                                />
                            </div>
                            
                            <span className="evo-id">Nº {String(evo.id).padStart(4, '0')}</span>
                            <span className="evo-name">{evo.name}</span>
                            
                            {/* AQUÍ USAMOS LOS ICONOS SVG */}
                            <div className="evo-types-row">
                                {evo.types.map((t) => {
                                    const iconSrc = TYPE_ICONS[t.type.name];
                                    return iconSrc ? (
                                        <img 
                                            key={t.type.name} 
                                            src={iconSrc} 
                                            alt={t.type.name}
                                            className="evo-type-icon"
                                        />
                                    ) : null;
                                })}
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

export default PostDetail;