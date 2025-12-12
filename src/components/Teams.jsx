import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import "./Teams.css";

import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg'; 
import EDIT_ICON from '/src/images/icono_editar/EDIT.svg'; 

function Teams() {
  const { teams, addTeam, updateTeamName, removePokemonFromSlot, promoteTeam } = useTeams();
  const navigate = useNavigate();
  
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [tempName, setTempName] = useState("");

  const handleEmptySlot = (teamId, slotIndex) => {
    navigate('/PostList', { state: { selectionMode: true, teamId, slotIndex } });
  };

  const handleFilledSlot = (pokemonId) => {
    navigate(`/PostDetail/${pokemonId}`, { state: { viewOnlyMode: true } });
  };

  const toggleEdit = (team) => {
    if (editingTeamId === team.id) {
      if (tempName.trim() === "") {
        setEditingTeamId(null);
      } else {
        updateTeamName(team.id, tempName);
        setEditingTeamId(null);
      }
    } 
    else {
      promoteTeam(team.id);
      setTempName(team.name);
      setEditingTeamId(team.id);
    }
  };

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
      {/* HEADER EXACTO A POSTLIST */}
      <header className="detail-header2">
        <Link to="/" className="back-btn">
          <img src={ICONO_ATRAS} alt="Volver" className="back-icon2" />
        </Link>
        <h1 className="title">Equipos</h1>
        {/* Eliminado el div fantasma para usar position: absolute */}
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