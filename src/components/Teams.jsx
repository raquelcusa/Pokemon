import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import "./Teams.css";

import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg'; 
import EDIT_ICON from '/src/images/icono_editar/EDIT.svg'; 

function Teams() {
  const { teams, addTeam, removeTeam, updateTeamName, removePokemonFromSlot, promoteTeam } = useTeams();
  const navigate = useNavigate();
  
  // Estado para saber qué equipo se está editando
  const [editingTeamId, setEditingTeamId] = useState(null);
  // Estado para el texto temporal del input
  const [tempName, setTempName] = useState("");

  // Navegación: Ir a elegir Pokémon
  const handleEmptySlot = (teamId, slotIndex) => {
    navigate('/PostList', { state: { selectionMode: true, teamId, slotIndex } });
  };

  // Navegación: Ir a ver detalle (solo vista)
  const handleFilledSlot = (pokemonId) => {
    navigate(`/PostDetail/${pokemonId}`, { state: { viewOnlyMode: true } });
  };

  // Lógica del Lápiz (Editar / Guardar)
  const toggleEdit = (team) => {
    if (editingTeamId === team.id) {
      // Estamos guardando
      if (tempName.trim() === "") {
        // Si está vacío, cancelamos edición (vuelve al nombre original)
        setEditingTeamId(null);
      } else {
        // Guardamos cambios
        updateTeamName(team.id, tempName);
        setEditingTeamId(null);
      }
    } else {
      // Empezamos a editar
      promoteTeam(team.id);       // Sube arriba
      setTempName(team.name);     // Copia nombre al input
      setEditingTeamId(team.id);  // Activa modo edición
    }
  };

  // Guardar al pulsar Enter
  const handleKeyDown = (e, team) => {
    if (e.key === 'Enter') {
      toggleEdit(team);
    }
  };

  // Borrar Pokémon (slot)
  const handleDeleteSlotClick = (e, teamId, index) => {
    e.stopPropagation(); 
    removePokemonFromSlot(teamId, index);
  };

  // Borrar Equipo Completo (Botón esquina)
  const handleDeleteTeam = (teamId) => {
    removeTeam(teamId);
    setEditingTeamId(null); // Salimos del modo edición
  };

  return (
    <div className="teams-container">
      
      {/* HEADER EXACTO A POSTLIST */}
      <header className="detail-header2">
        <Link to="/" className="back-btn">
          <img src={ICONO_ATRAS} alt="Volver" className="back-icon2" />
        </Link>
        <h1 className="title">Equipos</h1>
      </header>

      {/* BOTÓN AÑADIR (ARRIBA) */}
      <div className="add-team-wrapper-top">
         <button className="add-team-btn" onClick={addTeam}>
            <div className="plus-circle">+</div>
            <span>Añadir nuevo equipo</span>
         </button>
      </div>

      {/* LISTA DE EQUIPOS */}
      <div className="teams-list">
        {teams.map((team) => {
          const isEditing = editingTeamId === team.id;

          return (
            <div key={team.id} className="team-card">
              
              {/* BOTÓN ELIMINAR EQUIPO (SOLO EN MODO EDICIÓN) */}
              {isEditing && (
                <button 
                  className="delete-team-btn-corner"
                  onClick={() => handleDeleteTeam(team.id)}
                >
                  <span>×</span>
                </button>
              )}

              {/* CABECERA TARJETA (Nombre + Lápiz) */}
              <div className="team-header">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="team-name-input"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, team)}
                    autoFocus 
                    placeholder="Nombre del equipo"
                  />
                ) : (
                  <span className="team-name">{team.name}</span>
                )}
                
                <img 
                  src={EDIT_ICON} 
                  alt="Editar" 
                  className={`edit-icon ${isEditing ? 'active' : ''}`}
                  onClick={() => toggleEdit(team)}
                />
              </div>

              {/* GRID DE SLOTS (3x2) */}
              <div className="slots-grid">
                {team.slots.map((pokemon, index) => (
                  <div key={index} className="slot-item">
                    {pokemon ? (
                      <div className="slot-wrapper">
                         {/* Botón borrar Pokémon (mini cruz) */}
                         {isEditing && (
                            <button 
                              className="delete-badge"
                              onClick={(e) => handleDeleteSlotClick(e, team.id, index)}
                            >
                              ×
                            </button>
                         )}

                         {/* Imagen Pokémon */}
                         <div className="slot-filled" onClick={() => !isEditing && handleFilledSlot(pokemon.id)}>
                            <img 
                              src={pokemon.sprites?.versions?.["generation-viii"]?.icons?.front_default || pokemon.sprite} 
                              alt={pokemon.name} 
                              className="slot-img"
                            />
                         </div>
                      </div>
                    ) : (
                      /* Botón Slot Vacío (+) */
                      <button 
                        className="slot-empty-btn"
                        onClick={() => !isEditing && handleEmptySlot(team.id, index)}
                        style={{ opacity: isEditing ? 0.5 : 1 }}
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Teams;