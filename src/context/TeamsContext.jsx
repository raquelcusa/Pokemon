import { createContext, useState, useContext } from 'react';

const TeamsContext = createContext();

export function TeamsProvider({ children }) {
  // Estado inicial con 2 equipos vacíos
  const [teams, setTeams] = useState([
    { id: 1, name: "Equipo 1", slots: [null, null, null, null, null, null] },
    { id: 2, name: "Equipo 2", slots: [null, null, null, null, null, null] }
  ]);

  // Función auxiliar: Mueve un equipo al principio de la lista (índice 0)
  const moveTeamToTop = (updatedTeam) => {
    const otherTeams = teams.filter(t => t.id !== updatedTeam.id);
    setTeams([updatedTeam, ...otherTeams]);
  };

  // 1. AÑADIR EQUIPO (Se añade al principio)
  const addTeam = () => {
    const newId = Date.now(); 
    const newTeam = { 
      id: newId, 
      name: `Nuevo Equipo`, 
      slots: [null, null, null, null, null, null] 
    };
    setTeams([newTeam, ...teams]);
  };

  // 2. ELIMINAR EQUIPO COMPLETO
  const removeTeam = (teamId) => {
    setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
  };

  // 3. AÑADIR POKÉMON A UN SLOT
  const updateSlot = (teamId, slotIndex, pokemon) => {
    const teamToUpdate = teams.find(t => t.id === teamId);
    if (!teamToUpdate) return;

    const newSlots = [...teamToUpdate.slots];
    newSlots[slotIndex] = pokemon;
    
    // Actualizamos y movemos arriba
    moveTeamToTop({ ...teamToUpdate, slots: newSlots });
  };

  // 4. ACTUALIZAR NOMBRE DEL EQUIPO
  const updateTeamName = (teamId, newName) => {
    const teamToUpdate = teams.find(t => t.id === teamId);
    if (!teamToUpdate) return;
    
    moveTeamToTop({ ...teamToUpdate, name: newName });
  };

  // 5. ELIMINAR POKÉMON DE UN SLOT
  const removePokemonFromSlot = (teamId, slotIndex) => {
    const teamToUpdate = teams.find(t => t.id === teamId);
    if (!teamToUpdate) return;

    const newSlots = [...teamToUpdate.slots];
    newSlots[slotIndex] = null;
    
    moveTeamToTop({ ...teamToUpdate, slots: newSlots });
  };

  // 6. SOLO PROMOVER (Para cuando le das al lápiz)
  const promoteTeam = (teamId) => {
    const teamToMove = teams.find(t => t.id === teamId);
    if (teamToMove) {
      moveTeamToTop(teamToMove);
    }
  };

  return (
    <TeamsContext.Provider value={{ 
      teams, 
      addTeam, 
      removeTeam, 
      updateSlot, 
      updateTeamName, 
      removePokemonFromSlot, 
      promoteTeam 
    }}>
      {children}
    </TeamsContext.Provider>
  );
}

export const useTeams = () => useContext(TeamsContext);