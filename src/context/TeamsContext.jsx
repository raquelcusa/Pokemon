import { createContext, useState, useContext } from 'react';

const TeamsContext = createContext();

export function TeamsProvider({ children }) {
  const [teams, setTeams] = useState([
    { id: 1, name: "Equipo 1", slots: [null, null, null, null, null, null] },
    { id: 2, name: "Equipo 2", slots: [null, null, null, null, null, null] }
  ]);

  const moveTeamToTop = (updatedTeam) => {
    const otherTeams = teams.filter(t => t.id !== updatedTeam.id);
    setTeams([updatedTeam, ...otherTeams]);
  };

  const addTeam = () => {
    const newId = Date.now(); 
    const newTeam = { 
      id: newId, 
      name: `Nuevo Equipo`, 
      slots: [null, null, null, null, null, null] 
    };
    setTeams([newTeam, ...teams]);
  };

  const updateSlot = (teamId, slotIndex, pokemon) => {
    const teamToUpdate = teams.find(t => t.id === teamId);
    if (!teamToUpdate) return;
    const newSlots = [...teamToUpdate.slots];
    newSlots[slotIndex] = pokemon;
    moveTeamToTop({ ...teamToUpdate, slots: newSlots });
  };

  const updateTeamName = (teamId, newName) => {
    const teamToUpdate = teams.find(t => t.id === teamId);
    if (!teamToUpdate) return;
    moveTeamToTop({ ...teamToUpdate, name: newName });
  };

  const removePokemonFromSlot = (teamId, slotIndex) => {
    const teamToUpdate = teams.find(t => t.id === teamId);
    if (!teamToUpdate) return;
    const newSlots = [...teamToUpdate.slots];
    newSlots[slotIndex] = null;
    moveTeamToTop({ ...teamToUpdate, slots: newSlots });
  };

  // --- NUEVA FUNCIÓN: Solo mover al principio (sin cambiar datos) ---
  const promoteTeam = (teamId) => {
    const teamToMove = teams.find(t => t.id === teamId);
    if (teamToMove) {
      moveTeamToTop(teamToMove);
    }
  };

  return (
    // Añadimos promoteTeam al value
    <TeamsContext.Provider value={{ teams, addTeam, updateSlot, updateTeamName, removePokemonFromSlot, promoteTeam }}>
      {children}
    </TeamsContext.Provider>
  );
}

export const useTeams = () => useContext(TeamsContext);