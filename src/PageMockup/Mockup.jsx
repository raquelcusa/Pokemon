import { useState, useEffect } from "react";
import "./Mockup.css";

function Mockup() {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=200")
      .then((res) => res.json())
      .then((data) => {
        return Promise.all(
          data.results.map((p) =>
            fetch(p.url)
              .then((res) => res.json())
              .then((details) => ({
                id: details.id,
                name: details.name,
                sprite:
                  details.sprites.versions["generation-viii"].icons
                    .front_default,
                types: details.types.map((t) => t.type.name), // array of 1 or 2 types
              }))
          )
        );
      })
      .then((fullList) => setPokemonList(fullList))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Pokémon List</h1>

      <ul>
        {pokemonList.map((p) => (
          <li key={p.id}>
            <img src={p.sprite} alt={p.name} />

            <strong>#{p.id} {p.name}</strong>

            <div className="types">
              {p.types.map((type, i) => (
                <span key={i} className={`type ${type}`}>
                  {type}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Mockup;