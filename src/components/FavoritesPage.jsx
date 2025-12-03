import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';
import '../components/FavoritesPage.css'; // Importante: Usamos los estilos de la lista

/* -- IMPORTACIÓN DE ICONOS (Igual que en PostList) -- */
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

// Mapeo de iconos
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

function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  // Estado vacío
  if (!favorites || favorites.length === 0) {
    return (
        <div className="pokedex-container" style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
            <h2>No tienes favoritos aún</h2>
            <Link to="/" style={{ color: '#FAC000', textDecoration: 'none', fontWeight: 'bold' }}>Ir a la Pokédex</Link>
        </div>
    );
  }

  return (
    <div className="pokedex-container">
      {/* Reutilizamos clases de PostList */}
      <header className="detail-header2">
        <Link to="/" className="back-btn" style={{textDecoration: 'none', color: 'white', fontSize: '1.5rem'}}>
          {/* Puedes usar el icono de atrás si lo importas, o una flecha simple */}
          &#8592; 
        </Link>
        <h1 className="title">Mis Favoritos</h1>
      </header>
      
      <div className="pokemon-grid">
        {favorites.map((p) => {
            // --- LÓGICA DE NORMALIZACIÓN DE DATOS ---
            // Como PostDetail guarda el objeto crudo de la API, la ruta de la imagen es profunda.
            // Intentamos buscar la imagen HD, si no la normal, si no la propiedad 'sprite' (por si acaso).
            const imageUrl = p.sprites?.other?.["official-artwork"]?.front_default 
                          || p.sprites?.front_default 
                          || p.sprite;

            // En PostDetail los tipos son [{type: {name: 'fire'}}], en PostList son ['fire'].
            // Hacemos un map para asegurar que tenemos un array de strings simples.
            const typesArray = p.types.map(t => t.type ? t.type.name : t);

            return (
              <div key={p.id} style={{ position: 'relative' }}>
                
                <Link to={`/PostDetail/${p.id}`} className="pokemon-card-link">
                  <div className="pokemon-card">
                    <div className="card-image-container">
                      <img src={imageUrl} alt={p.name} className="pokemon-img" />
                    </div>
                    
                    <div className="card-footer">
                      <span className="pokemon-id">Nº {String(p.id).padStart(4, '0')}</span>
                      <span className="pokemon-name">{p.name}</span>
                      
                      <div className="types-row">
                        {typesArray.map((typeName) => (
                          TYPE_ICONS[typeName] ? ( 
                            <img
                              key={typeName} 
                              src={TYPE_ICONS[typeName]} 
                              alt={typeName} 
                              className="type-icon-mini" 
                            />
                          ) : null
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Botón de borrar estilizado */}
                <button 
                    onClick={(e) => {
                        e.preventDefault(); // Evitar que el click vaya al Link
                        toggleFavorite(p);
                    }}
                    style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ff4d4d',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: 10,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    X
                </button>
              </div>
            );
        })}
      </div>
    </div>
  );
}

export default FavoritesPage;