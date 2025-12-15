import { useState, useEffect, useCallback, useRef } from "react";
import "./PostList.css";
import { Link, useLocation } from "react-router-dom";
import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg'; 

/* -- ICONES TIPUS --*/
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

const TYPE_CONFIG = {
  normal: { name: "Normal", color: "#A8A77A" },
  fire: { name: "Fuego", color: "#E62829" },
  water: { name: "Agua", color: "#2980EF" },
  electric: { name: "Eléctrico", color: "#FAC000" },
  grass: { name: "Planta", color: "#3FA129" },
  ice: { name: "Hielo", color: "#3FD8FF" },
  fighting: { name: "Lucha", color: "#FF8000" },
  poison: { name: "Veneno", color: "#8F41CB" },
  ground: { name: "Tierra", color: "#915121" },
  flying: { name: "Volador", color: "#81B9EF" },
  psychic: { name: "Psíquico", color: "#EF4179" },
  bug: { name: "Bicho", color: "#91A119" },
  rock: { name: "Roca", color: "#AFA981" },
  ghost: { name: "Fantasma", color: "#704170" },
  dragon: { name: "Dragón", color: "#5061E1" },
  steel: { name: "Acero", color: "#60A1B8" },
  dark: { name: "Siniestro", color: "#50413F" },
  fairy: { name: "Hada", color: "#EF71EF" },
};

function PostList() {
  const location = useLocation(); 
  const selectionState = location.state;
  const selectionMode = location.state?.selectionMode;
  const backDestination = selectionMode ? "/teams" : "/";

  // --- FILTERS & SORT STATE ---
  const [selectedType, setSelectedType] = useState(null); 
  const [sortOrder, setSortOrder] = useState("id_asc"); 
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- UI STATE ---
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // --- DATA STATE ---
  const [allPokemon, setAllPokemon] = useState([]); 
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [displayedPokemon, setDisplayedPokemon] = useState([]); 

  // --- LAZY LOADING STATE ---
  const [offset, setOffset] = useState(0); // number of items currently displayed
  const LIMIT = 20; // items per batch
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null); // sentinel for IntersectionObserver

  // ==========================================
  // STEP 1: GRAPHQL FETCH (Carga masiva eficiente)
  // ==========================================
  useEffect(() => {
    const fetchAllPokemonGraphQL = async () => {
      setIsLoading(true);
      setAllPokemon([]);
      setDisplayedPokemon([]);
      setHasMore(true);
      setOffset(0);

      const query = `
        query {
          pokemon_v2_pokemon(where: {id: {_lte: 1025}}) {
            id
            name
            pokemon_v2_pokemontypes {
              pokemon_v2_type {
                name
              }
            }
          }
        }
      `;

      try {
        const response = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        const json = await response.json();
        const formattedData = json.data.pokemon_v2_pokemon.map(p => ({
          id: p.id,
          name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${p.id}.png`,
          types: p.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name)
        }));

        setAllPokemon(formattedData);
        setFilteredPokemon(formattedData);

      } catch (error) {
        console.error("Error fetching GraphQL:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPokemonGraphQL();
  }, []);

  // ==========================================
  // STEP 2: FILTER & SORT LOGIC
  // ==========================================
  useEffect(() => {
    if (allPokemon.length === 0) return;

    let result = [...allPokemon];

    if (selectedType) {
      result = result.filter(p => p.types.includes(selectedType));
    }

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        String(p.id).includes(searchTerm)
      );
    }

    result.sort((a, b) => {
      switch (sortOrder) {
        case "id_asc": return a.id - b.id;
        case "id_desc": return b.id - a.id;
        case "name_asc": return a.name.localeCompare(b.name);
        case "name_desc": return b.name.localeCompare(a.name);
        default: return a.id - b.id;
      }
    });

    setFilteredPokemon(result);

    // Reset displayed list based on new filters/sort
    const initialCount = Math.min(LIMIT, result.length);
    setDisplayedPokemon(result.slice(0, initialCount));
    setOffset(initialCount);
    setHasMore(result.length > initialCount);

  }, [selectedType, searchTerm, sortOrder, allPokemon]);

  // ==========================================
  // STEP 3: BATCH LOADER (IntersectionObserver)
  // ==========================================
  const loadNextBatch = useCallback(async () => {
    if (isLoading) return; // prevent re-entry
    if (offset >= filteredPokemon.length) {
      setHasMore(false);
      return;
    }

    setIsLoading(true);

    const nextOffset = Math.min(offset + LIMIT, filteredPokemon.length);
    const newItems = filteredPokemon.slice(offset, nextOffset); // append only the new items

    // Small artificial delay removed — this is instant for local data
    setDisplayedPokemon(prev => [...prev, ...newItems]);
    setOffset(nextOffset);

    if (nextOffset >= filteredPokemon.length) {
      setHasMore(false);
    }

    setIsLoading(false);
  }, [offset, filteredPokemon, LIMIT, isLoading]);

  // IntersectionObserver to trigger loading when sentinel becomes visible
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadNextBatch();
        }
      });
    }, { root: null, rootMargin: '500px', threshold: 0 }); // 500px buffer like your previous -500px check

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadNextBatch, hasMore, isLoading]);

  return (
    <div className="pokedex-container">
      {/* Header */}
      <header className="detail-header2">
        <Link to={backDestination} className="back-btn">
          <img src={ICONO_ATRAS} alt="Volver" className="back-icon2" />
        </Link>
        <h1 className="title">Pokédex</h1>
      </header>

      {/* Search */}
      <div className="search-wrapper">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Buscar" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="filters">
        <button className="filter-btn" onClick={() => setShowTypeModal(true)}>
          {selectedType ? TYPE_CONFIG[selectedType].name : "Tipos"} <span>▼</span>
        </button>
        <button className="filter-btn" onClick={() => setShowSortModal(true)}>
          Ordenar por <span>▼</span>
        </button>
      </div>

      {/* Grid */}
      <div className="pokemon-grid">
        {displayedPokemon.map((p) => (
          <Link to={`/PostDetail/${p.id}`} state={selectionState} key={`${p.id}-${p.name}`} className="pokemon-card-link">
            <div className="pokemon-card">
              <div className="card-image-container">
                <img 
                    src={p.sprite} 
                    alt={p.name} 
                    className="pokemon-img"
                    loading="lazy"
                    onError={(e) => { 
                        e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`; 
                        e.target.onerror = null; 
                    }} 
                />
              </div>
              <div className="card-footer">
                <span className="pokemon-id">Nº {String(p.id).padStart(4, '0')}</span>
                <span className="pokemon-name">{p.name}</span>
                <div className="types-row">
                  {p.types.map((type) => (
                    TYPE_ICONS[type] ? ( 
                      <img
                        key={type} 
                        src={TYPE_ICONS[type]} 
                        alt={type} 
                        className="type-icon-mini" 
                      />
                    ) : null
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Sentinel observed by IntersectionObserver to trigger next load */}
      <div ref={loaderRef} style={{ height: 1 }} />

      {/* Loaders */}
      {isLoading && <div className="loader">Cargando Pokédex...</div>}
      {!hasMore && displayedPokemon.length > 0 && <div className="loader">Fin de la lista.</div>}
      {!isLoading && displayedPokemon.length === 0 && (
         <div className="loader">No se encontraron resultados.</div>
      )}

      {/* --- TYPE MODAL --- */}
      {showTypeModal && (
        <div className="modal-overlay" onClick={() => setShowTypeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Seleccione el tipo</h3>
            <div className="modal-options-grid">
              <button 
                className="type-option-btn" 
                style={{ background: "#333" }} 
                onClick={() => { setSelectedType(null); setShowTypeModal(false); }}
              >
                Todos
              </button>
              {Object.keys(TYPE_CONFIG).map((typeKey) => (
                <button
                  key={typeKey}
                  className="type-option-btn"
                  style={{ backgroundColor: TYPE_CONFIG[typeKey].color }}
                  onClick={() => {
                    setSelectedType(typeKey);
                    setShowTypeModal(false);
                  }}
                >
                  {TYPE_CONFIG[typeKey].name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SORT MODAL --- */}
      {showSortModal && (
        <div className="modal-overlay" onClick={() => setShowSortModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Seleccione el orden</h3>
            <div className="modal-options-list">
              <button className="sort-option-btn" onClick={() => { setSortOrder("id_asc"); setShowSortModal(false); }}>
                Nº Ascendente
              </button>
              <button className="sort-option-btn" onClick={() => { setSortOrder("id_desc"); setShowSortModal(false); }}>
                Nº Descendente
              </button>
              <button className="sort-option-btn" onClick={() => { setSortOrder("name_asc"); setShowSortModal(false); }}>
                A-Z
              </button>
              <button className="sort-option-btn" onClick={() => { setSortOrder("name_desc"); setShowSortModal(false); }}>
                Z-A
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostList;