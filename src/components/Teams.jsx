import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import "./Teams.css";

import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg'; 
import EDIT_ICON from '/src/images/icono_editar/EDIT.svg'; 

function Teams() {
  const { teams, addTeam, updateTeamName, removePokemonFromSlot, promoteTeam } = useTeams();
  const navigate = useNavigate();
  
  // Estado para saber QUÉ equipo se edita
  const [editingTeamId, setEditingTeamId] = useState(null);
  
  // NUEVO: Estado temporal para el texto del input mientras escribes
  const [tempName, setTempName] = useState("");

  const handleEmptySlot = (teamId, slotIndex) => {
    navigate('/PostList', { state: { selectionMode: true, teamId, slotIndex } });
  };

  const handleFilledSlot = (pokemonId) => {
    navigate(`/PostDetail/${pokemonId}`, { state: { viewOnlyMode: true } });
  };

  // --- LÓGICA DE EDICIÓN MODIFICADA ---
  const toggleEdit = (team) => {
    // CASO 1: YA ESTABA EDITANDO ESTE EQUIPO (QUEREMOS CERRAR/GUARDAR)
    if (editingTeamId === team.id) {
      // Validación: ¿Está vacío?
      if (tempName.trim() === "") {
        // Si está vacío, NO llamamos a updateTeamName.
        // Simplemente cerramos la edición, y el nombre volverá a ser el que era antes (el del context).
        setEditingTeamId(null);
      } else {
        // Si tiene texto, guardamos los cambios en el contexto global
        updateTeamName(team.id, tempName);
        setEditingTeamId(null);
      }
    } 
    // CASO 2: VAMOS A EMPEZAR A EDITAR
    else {
      promoteTeam(team.id);       // Lo subimos arriba
      setTempName(team.name);     // Copiamos el nombre actual al input temporal
      setEditingTeamId(team.id);  // Activamos el modo edición
    }
  };

  // Manejo de la tecla Enter para guardar también
  const handleKeyDown = (e, team) => {
    if (e.key === 'Enter') {
      toggleEdit(team);
    }
  };

  const handleDeleteClick = (e, teamId, index) => {
    e.stopPropagation(); 
    removePokemonFromSlot(teamId, index);
  };

  return (
    <div className="teams-container">
      <header className="detail-header2">
        <Link to="/" className="back-btn">
          <img src={ICONO_ATRAS} alt="Volver" className="back-icon2" />
        </Link>
        <h1 className="title">Equipos</h1>
        <div style={{width: 48}}></div> 
      </header>

      <div className="add-team-wrapper-top">
         <button className="add-team-btn" onClick={addTeam}>
            <div className="plus-circle">+</div>
            <span>Añadir nuevo equipo</span>
         </button>
      </div>

      <div className="teams-list">
        {teams.map((team) => {
          const isEditing = editingTeamId === team.id;

          return (
            <div key={team.id} className="team-card">
              
              <div className="team-header">
                {isEditing ? (
                  // MODO EDICIÓN: Usamos tempName y setTempName
                  <input 
                    type="text" 
                    className="team-name-input"
                    value={tempName} // Valor temporal
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, team)}
                    autoFocus 
                    placeholder="Nombre del equipo" // EL PLACEHOLDER QUE PEDISTE
                  />
                ) : (
                  // MODO VISUALIZACIÓN: Usamos el nombre real del Context
                  <span className="team-name">{team.name}</span>
                )}
                
                <img 
                  src={EDIT_ICON} 
                  alt="Editar" 
                  className={`edit-icon ${isEditing ? 'active' : ''}`}
                  // Pasamos el objeto 'team' entero a la función
                  onClick={() => toggleEdit(team)}
                />
              </div>

              <div className="slots-grid">
                {team.slots.map((pokemon, index) => (
                  <div key={index} className="slot-item">
                    {pokemon ? (
                      <div className="slot-wrapper">
                         {isEditing && (
                            <button 
                              className="delete-badge"
                              onClick={(e) => handleDeleteClick(e, team.id, index)}
                            >
                              ×
                            </button>
                         )}

                         <div className="slot-filled" onClick={() => !isEditing && handleFilledSlot(pokemon.id)}>
                            <img 
                              src={pokemon.sprites?.versions?.["generation-viii"]?.icons?.front_default || pokemon.sprite} 
                              alt={pokemon.name} 
                              className="slot-img"
                            />
                         </div>
                      </div>
                    ) : (
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