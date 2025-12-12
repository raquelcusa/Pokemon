import React, { useState, useMemo } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';
import '../components/FavoritesPage.css'; 

// Importación de iconos (para el header o detalles si fuera necesario, aunque usaremos pills para tipos)
import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg'; 
import ICONO_POKEDEX from '../images/icono_pokedex/POKEDEX.png';

// Configuración de Tipos (Colores y Nombres en Español)
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

function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  // --- ESTADOS DE FILTROS (Igual que en PostList) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [sortOrder, setSortOrder] = useState("id_asc");
  
  // Estados de Modales
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // --- LÓGICA DE FILTRADO Y ORDENACIÓN ---
  const filteredFavorites = useMemo(() => {
    if (!favorites) return [];
    
    let result = [...favorites];

    // 1. Normalizar tipos antes de filtrar (asegurar que es un array de strings)
    // Esto es necesario porque favorites puede tener objetos complejos
    result = result.map(p => {
        const normalizedTypes = p.types.map(t => t.type ? t.type.name : t);
        return { ...p, normalizedTypes }; // Añadimos propiedad temporal
    });

    // 2. Buscador
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // 3. Filtrar por Tipo
    if (selectedType) {
      result = result.filter(p => p.normalizedTypes.includes(selectedType));
    }

    // 4. Ordenar
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
  }, [favorites, searchTerm, selectedType, sortOrder]);


  // --- RENDERIZADO ---
  if (!favorites || favorites.length === 0) {
    return (
        <div className="pokedex-container empty-state">
            <h2>No tienes favoritos aún</h2>
            <Link to="/PostList" className="empty-link">Ir a la Pokédex</Link>
        </div>
    );
  }

  return (
    <div className="pokedex-container">
      
      {/* HEADER */}
      <header className="detail-header2">
        <Link to="/" className="back-btn">
             {/* Usamos el SVG importado o una flecha simple si falla */}
             <img src={ICONO_ATRAS} alt="Volver" className="back-icon2" style={{width: '24px'}} />
        </Link>
        <h1 className="title">Favoritos</h1>
      </header>

      {/* BUSCADOR */}
      <div className="search-wrapper">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Buscar" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* FILTROS */}
      <div className="filters">
        <button className="filter-btn" onClick={() => setShowTypeModal(true)}>
          {selectedType ? TYPE_CONFIG[selectedType].name : "Tipos"} <span>▼</span>
        </button>
        <button className="filter-btn" onClick={() => setShowSortModal(true)}>
          Ordenar por <span>▼</span>
        </button>
      </div>
      
      {/* LISTA DE FAVORITOS (Diseño Horizontal) */}
      <div className="favorites-list-container">
        {filteredFavorites.map((p) => {
            // Normalización de Imagen
            const imageUrl = p.sprites?.other?.["official-artwork"]?.front_default 
                          || p.sprites?.front_default 
                          || p.sprite;
            
            // Usamos los tipos normalizados que calculamos o los recalculamos
            const typesArray = p.normalizedTypes || p.types.map(t => t.type ? t.type.name : t);

            return (
              <div key={p.id} className="fav-card-wrapper">
                <Link to={`/PostDetail/${p.id}`} className="fav-card-link">
                  <div className="fav-card">
                    
                    {/* Izquierda: Info */}
                    <div className="fav-info-col">
                      <span className="fav-name">{p.name}</span>
                     
                      <span className="fav-id"> <img src={ICONO_POKEDEX} alt="Pokedex" className="pokedex-icon" />
                        Nº {String(p.id).padStart(4, '0')}</span>
                      
                      <div className="fav-types-row">
                        {typesArray.map((typeName) => {
                            const config = TYPE_CONFIG[typeName];
                            if (!config) return null;
                            return (
                                <span 
                                    key={typeName} 
                                    className="type-pill"
                                    style={{ backgroundColor: config.color }}
                                >
                                    {config.name}
                                </span>
                            );
                        })}
                      </div>
                    </div>

                    {/* Derecha: Imagen */}
                    <div className="fav-image-col">
                      <img src={imageUrl} alt={p.name} className="fav-img" />
                      {/* Fondo decorativo de hojas/patrón podría ir aquí como background-image en CSS */}
                    </div>

                  </div>
                </Link>

                {/* Botón Borrar (X) */}
                <button 
                    className="delete-fav-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(p);
                    }}
                >
                    X
                </button>
              </div>
            );
        })}
      </div>

      {/* --- MODAL DE TIPOS --- */}
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

      {/* --- MODAL DE ORDENAR --- */}
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

export default FavoritesPage;