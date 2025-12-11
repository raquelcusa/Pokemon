import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import "./Teams.css";

// Imports de iconos
import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg'; 

function Teams() {
  const { teams, addTeam } = useTeams(); // ← editTeamName eliminado
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
        <div style={{width: 48}}></div> 
      </header>

      <div className="teams-list">
        {teams.map((team) => (
          <div key={team.id} className="team-card">

            {/* NOMBRE DEL EQUIPO AUTOMÁTICO */}
            <div className="team-header">
              <span className="team-name">{team.name}</span>
            </div>

            <div className="slots-grid">
              {team.slots.map((pokemon, index) => (
                <div key={index} className="slot-item">
                  {pokemon ? (
                    <div className="slot-filled" onClick={() => handleSlotClick(team.id, index)}>
                        <img 
                          src={pokemon.sprites?.versions?.["generation-viii"]?.icons?.front_default || pokemon.sprite} 
                          alt={pokemon.name} 
                          className="slot-img"
                        />
                    </div>
                  ) : (
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
