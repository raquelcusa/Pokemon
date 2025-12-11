import { createContext, useState, useContext } from 'react';

const TeamsContext = createContext();

export function TeamsProvider({ children }) {
  // Inicializamos con 2 equipos vacíos por defecto (según diseño)
  // Cada equipo tiene 6 slots (null significa vacío)
  const [teams, setTeams] = useState([
    { id: 1, name: "Equipo 1", slots: [null, null, null, null, null, null] },
    { id: 2, name: "Equipo 2", slots: [null, null, null, null, null, null] }
  ]);

  // Función para añadir un nuevo equipo vacío
  const addTeam = () => {
    const newId = teams.length + 1;
    setTeams([...teams, { 
      id: newId, 
      name: `Equipo ${newId}`, 
      slots: [null, null, null, null, null, null] 
    }]);
  };

  // Función para guardar un Pokémon en un slot específico
  const updateSlot = (teamId, slotIndex, pokemon) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const newSlots = [...team.slots];
        newSlots[slotIndex] = pokemon;
        return { ...team, slots: newSlots };
      }
      return team;
    }));
  };

  // Función para cambiar nombre del equipo (Opcional, para el lápiz)
  const updateTeamName = (teamId, newName) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, name: newName } : team
    ));
  };

  return (
    <TeamsContext.Provider value={{ teams, addTeam, updateSlot, updateTeamName }}>
      {children}
    </TeamsContext.Provider>
  );
}

export const useTeams = () => useContext(TeamsContext);