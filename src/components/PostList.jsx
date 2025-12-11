import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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

// Diccionari de colors i traduccions per als tipus
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
  // 1. "allReferences": The lightweight list of ALL pokemon {name, url} matching the Type filter.
  const [allReferences, setAllReferences] = useState([]);
  
  // 2. "processedReferences": The 'allReferences' list after Search and Sorting are applied.
  const [processedReferences, setProcessedReferences] = useState([]);

  // 3. "displayedPokemon": The heavy list of Pokemon with images currently shown on screen.
  const [displayedPokemon, setDisplayedPokemon] = useState([]);

  // --- LAZY LOADING STATE ---
  const [offset, setOffset] = useState(0);
  const LIMIT = 50; 
  const [isLoadingRefs, setIsLoadingRefs] = useState(false); // Loading the big list
  const [isLoadingDetails, setIsLoadingDetails] = useState(false); // Loading the images
  const [hasMore, setHasMore] = useState(true);

  // Helper to extract ID from URL
  const getIdFromUrl = (url) => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
  };

  // ==========================================
  // STEP 1: LOAD REFERENCES (Lightweight List)
  // ==========================================
  // This runs when the TYPE changes or on Mount.
  useEffect(() => {
    const fetchReferences = async () => {
      setIsLoadingRefs(true);
      setOffset(0);
      setDisplayedPokemon([]);
      setAllReferences([]); // Clear previous data

      try {
        let results = [];
        if (selectedType) {
          // Fetch ALL pokemon of specific type
          const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
          const data = await res.json();
          // Normalize structure: API returns { pokemon: { name, url } }
          results = data.pokemon.map(p => p.pokemon);
        } else {
          // Fetch ALL pokemon (Limit 10000 to get everything)
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1025`);
          const data = await res.json();
          results = data.results;
        }

        // Filter out ID > 10000 (special forms) if desired
        results = results.filter(p => getIdFromUrl(p.url) < 1026);

        setAllReferences(results);
      } catch (error) {
        console.error("Error fetching references:", error);
      } finally {
        setIsLoadingRefs(false);
      }
    };

    fetchReferences();
  }, [selectedType]); // Only re-run if Type changes

  // ==========================================
  // STEP 2: PROCESS REFERENCES (Sort & Filter)
  // ==========================================
  // This runs when the References load, OR Search/Sort changes.
  useEffect(() => {
    if (allReferences.length === 0 && !isLoadingRefs) return;

    let processed = [...allReferences];

    // A. Apply Search Filter
    if (searchTerm) {
      processed = processed.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // B. Apply Sorting
    processed.sort((a, b) => {
      const idA = getIdFromUrl(a.url);
      const idB = getIdFromUrl(b.url);

      switch (sortOrder) {
        case "id_asc": return idA - idB;
        case "id_desc": return idB - idA;
        case "name_asc": return a.name.localeCompare(b.name);
        case "name_desc": return b.name.localeCompare(a.name);
        default: return idA - idB;
      }
    });

    setProcessedReferences(processed);
    setOffset(0); // Reset pagination
    setDisplayedPokemon([]); // Clear displayed list to force reload with new order
    setHasMore(true);

  }, [allReferences, searchTerm, sortOrder, isLoadingRefs]);

  // ==========================================
  // STEP 3: LAZY LOAD DETAILS (Images/Types)
  // ==========================================
  // This function fetches the details for the next chunk of processedReferences.
  const loadNextBatch = useCallback(async () => {
    if (isLoadingDetails || !hasMore || processedReferences.length === 0) return;

    setIsLoadingDetails(true);

    // Calculate the slice we need
    const end = offset + LIMIT;
    const chunk = processedReferences.slice(offset, end);

    if (chunk.length === 0) {
      setHasMore(false);
      setIsLoadingDetails(false);
      return;
    }

    try {
      const detailsPromises = chunk.map(async (p) => {
        const res = await fetch(p.url);
        const details = await res.json();
        return {
          id: details.id,
          name: details.name,
          sprite: details.sprites?.versions?.["generation-viii"]?.icons?.front_default ||
                  details.sprites?.front_default || "",
          types: details.types.map((t) => t.type.name),
        };
      });

      const newDetails = await Promise.all(detailsPromises);

      setDisplayedPokemon((prev) => {
    // Create a Set of existing IDs to compare against efficiently
    const existingIds = new Set(prev.map((p) => p.id));
    
    // Only keep the new details that DO NOT already exist in the list
    const uniqueNewDetails = newDetails.filter((p) => !existingIds.has(p.id));
    
    // Return the combined list
    return [...prev, ...uniqueNewDetails];
});
      setOffset(prev => prev + LIMIT);
      
      if (end >= processedReferences.length) {
        setHasMore(false);
      }

    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [offset, processedReferences, isLoadingDetails, hasMore]);

  // Trigger initial batch load when processedReferences updates
  useEffect(() => {
    if (processedReferences.length > 0 && displayedPokemon.length === 0) {
      loadNextBatch();
    }
  }, [processedReferences, displayedPokemon.length, loadNextBatch]);


  // ==========================================
  // SCROLL HANDLER
  // ==========================================
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !isLoadingDetails &&
        hasMore
      ) {
        loadNextBatch();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadNextBatch, isLoadingDetails, hasMore]);


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
                <img src={p.sprite} alt={p.name} className="pokemon-img" />
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

      {/* Loaders */}
      {(isLoadingRefs || isLoadingDetails) && <div className="loader">Cargando...</div>}
      {!hasMore && displayedPokemon.length > 0 && <div className="loader">No hay más pokémon.</div>}
      {!isLoadingRefs && !isLoadingDetails && displayedPokemon.length === 0 && (
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
