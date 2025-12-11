import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import "./Teams.css";

// Imports de iconos
import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg'; 
// import EDIT_ICON from '/src/images/icono_editar/EDIT.svg'; // Aseguraos de tener este icono o usad texto

function Teams() {
  const { teams, addTeam } = useTeams();
  const navigate = useNavigate();

  // Función que redirige a PostList en "Modo Selección"
  const handleSlotClick = (teamId, slotIndex) => {
    navigate('/PostList', { 
      state: { 
        selectionMode: true, 
        teamId: teamId, 
        slotIndex: slotIndex 
      } 
    });
  };

  return (
    <div className="teams-container">
      {/* HEADER */}
      <header className="detail-header2">
        <Link to="/" className="back-btn">
          <img src={ICONO_ATRAS} alt="Volver" className="back-icon2" />
        </Link>
        <h1 className="title">Equipos</h1>
        {/* Botón fantasma para equilibrar el header si quieres, o + */}
        <div style={{width: 48}}></div> 
      </header>

      <div className="teams-list">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            
            {/* <div className="team-header">
              <span className="team-name">{team.name}</span> */}
              {/* Icono de lápiz decorativo */}
              {/* <img src={EDIT_ICON} alt="Editar" className="edit-icon" onError={(e) => e.target.style.display='none'} />
            </div> */}

            <div className="slots-grid">
              {team.slots.map((pokemon, index) => (
                <div key={index} className="slot-item">
                  {pokemon ? (
                    // SI HAY POKEMON: Mostramos su imagen pequeña
                    <div className="slot-filled" onClick={() => handleSlotClick(team.id, index)}>
                        <img 
                          src={pokemon.sprites?.versions?.["generation-viii"]?.icons?.front_default || pokemon.sprite} 
                          alt={pokemon.name} 
                          className="slot-img"
                        />
                    </div>
                  ) : (
                    // SI NO HAY POKEMON: Botón +
                    <button 
                      className="slot-empty-btn"
                      onClick={() => handleSlotClick(team.id, index)}
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* Botón Añadir Nuevo Equipo */}
      <div className="add-team-wrapper">
         <button className="add-team-btn" onClick={addTeam}>
            <div className="plus-circle">+</div>
            <span>Añadir nuevo equipo</span>
         </button>
      </div>

    </div>
  );
}

export default Teams;