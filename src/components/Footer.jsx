import './Footer.css';
import { Link } from "react-router-dom";
import ICONO_HOME from '/src/images/iconos_footer/HOME.svg';
import ICONO_BUSQUEDA from '/src/images/iconos_footer/BUSCAR.svg';
import ICONO_POKEDEX from '/src/images/iconos_footer/CARD.svg';
import ICONO_FAVORITOS from '/src/images/iconos_footer/FAV.svg';


function Footer() {
  return (
    <nav className="bottom-nav">
      
      {/* Botó Home */}
      <Link to="/" className="nav-item">
        <img src={ICONO_HOME} alt="Home" className="nav-icon" />
      </Link>

      {/* Botó Cerca */}
      <Link to="/PostList" className="nav-item">
        <img src={ICONO_BUSQUEDA} alt="Buscar" className="nav-icon" />
      </Link>

      {/* Botó Pokédex (Actiu) */}
      <Link to="/Teams" className="nav-item">
        <img src={ICONO_POKEDEX} alt="Pokedex" className="nav-icon" />
      </Link>

      {/* Botó Favorits */}
      <Link to="/Favorits" className="nav-item">
        <img src={ICONO_FAVORITOS} alt="Favoritos" className="nav-icon" />
      </Link>

    </nav>
  );
}

export default Footer;