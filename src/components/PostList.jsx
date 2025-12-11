import { useState, useEffect, useMemo } from "react";
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
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation(); 
  const selectionState = location.state;
  const selectionMode = location.state?.selectionMode; // Aquí vendrá { selectionMode, teamId, slotIndex }
  const backDestination = selectionMode ? "/teams" : "/";

  // Estats per Filtres i Orde
  const [selectedType, setSelectedType] = useState(null); // null significa "todos"
  const [sortOrder, setSortOrder] = useState("id_asc"); // id_asc, id_desc, name_asc, name_desc
  
  // Estats per visibilitat de Modals
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

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
                sprite: details.sprites.versions["generation-viii"].icons.front_default || details.sprites.front_default,
                types: details.types.map((t) => t.type.name),
              }))
          )
        );
      })
      .then((fullList) => setPokemonList(fullList))
      .catch((err) => console.error(err));
  }, []);

  // Lògica de Filtrat i Ordenació 
  const filteredAndSortedList = useMemo(() => {
    let result = [...pokemonList];

    // 1. Buscador (Search)
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // 2. Filtrar per Tipus
    if (selectedType) {
      result = result.filter(p => p.types.includes(selectedType));
    }

    // 3. Ordenar
    result.sort((a, b) => {
      switch (sortOrder) {
        case "id_asc": return a.id - b.id;
        case "id_desc": return b.id - a.id;
        case "name_asc": return a.name.localeCompare(b.name);
        case "name_desc": return b.name.localeCompare(a.name);
        default: return a.id - b.id;
      }
    });

    return result;
  }, [pokemonList, searchTerm, selectedType, sortOrder]);

  return (
    <div className="pokedex-container">
      {/* Capçalera */}
      <header className="detail-header2">
        
        {/* 3. USA LA VARIABLE EN EL LINK */}
        <Link to={backDestination} className="back-btn">
          <img src={ICONO_ATRAS} alt="Volver" className="back-icon2" />
        </Link>
        
        <h1 className="title">Pokédex</h1>
      </header>

      {/* Buscador */}
      <div className="search-wrapper">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Buscar" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filtres Botons */}
      <div className="filters">
        <button className="filter-btn" onClick={() => setShowTypeModal(true)}>
          {selectedType ? TYPE_CONFIG[selectedType].name : "Tipos"} <span>▼</span>
        </button>
        <button className="filter-btn" onClick={() => setShowSortModal(true)}>
          Ordenar por <span>▼</span>
        </button>
      </div>

      {/* Grid de Pokémons */}
      <div className="pokemon-grid">
        {filteredAndSortedList.map((p) => (
          <Link to={`/PostDetail/${p.id}`} state={selectionState} key={p.id} className="pokemon-card-link">
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

      {/* --- MODAL DE TIPUS --- */}
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

      {/* --- MODAL D'ORDENAR --- */}
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