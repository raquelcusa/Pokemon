import Greninja from '/src/images/Home_fondo/Greninja.png';
import './home.css';

function Home() {
  return (
    <div className="home-container">
      <div 
        className="home-hero"
        style={{ backgroundImage: `url(${Greninja})` }}
      ></div>

      {/* Bloque negro con texto y buscador */}
      <div className="home-search-card">
        <h2>Explora el<br />Mundo Pokémon !</h2>

        <div className="search-bar">
          <input type="text" placeholder="Buscar" />
        </div>
      </div>

      {/* Pokémon del Día */}
      <section className="section-title">Pokémon del Día</section>

      <div className="pokemon-day-card">
        <div className="pokemon-info">
          <h3>Ivysaur</h3>
          <p>Nº 0002</p>

          <div className="types">
            <span className="type type-grass">Planta</span>
            <span className="type type-poison">Veneno</span>
          </div>
        </div>

        <img 
          className="pokemon-img"
          src="/src/images/pokemon/ivysaur.png"
          alt="Ivysaur"
        />
      </div>

      {/* Favoritos */}
      <section className="section-title">Mis Favoritos</section>

      <div className="favorites-row">
        <img src="/src/images/pokemon/ivysaur.png" className="fav-img" />
        <img src="/src/images/pokemon/ivysaur.png" className="fav-img" />
        <img src="/src/images/pokemon/ivysaur.png" className="fav-img" />
      </div>

    </div>
  );
}

export default Home;
