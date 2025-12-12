import './Footer.css';
import { Link, useLocation } from "react-router-dom"; // 1. Importamos useLocation

// Iconos estado normal
import ICONO_HOME from '/src/images/iconos_footer/HOME.svg';
import ICONO_BUSQUEDA from '/src/images/iconos_footer/BUSCAR.svg';
import ICONO_POKEDEX from '/src/images/iconos_footer/CARD.svg';
import ICONO_FAVORITOS from '/src/images/iconos_footer/FAV.svg';

// Iconos estado activo (Asegúrate de importar tus imágenes alternativas aquí)
import ICONO_HOME_ACTIVE from '/src/images/iconos_footer/HOME_ACTIVE.svg';
import ICONO_BUSQUEDA_ACTIVE from '/src/images/iconos_footer/BUSCAR_ACTIVE.svg';
import ICONO_POKEDEX_ACTIVE from '/src/images/iconos_footer/CARD_ACTIVE.svg';
import ICONO_FAVORITOS_ACTIVE from '/src/images/iconos_footer/FAV_ACTIVE.svg';

function Footer() {
  const location = useLocation(); // 2. Obtenemos la ruta actual

  // Función auxiliar para saber si una ruta está activa
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      
      {/* Botón Home */}
      <Link to="/" className="nav-item">
        <img 
          src={isActive('/') ? ICONO_HOME_ACTIVE : ICONO_HOME} 
          alt="Home" 
          className="nav-icon" 
        />
      </Link>

      {/* Botón Cerca */}
      <Link to="/postList" className="nav-item">
        <img 
          src={isActive('/postList') ? ICONO_BUSQUEDA_ACTIVE : ICONO_BUSQUEDA} 
          alt="Buscar" 
          className="nav-icon" 
        />
      </Link>

      {/* Botón Pokédex */}
      <Link to="/teams" className="nav-item">
        <img 
          src={isActive('/teams') ? ICONO_POKEDEX_ACTIVE : ICONO_POKEDEX} 
          alt="Teams" 
          className="nav-icon" 
        />
      </Link>

      {/* Botón Favorits */}
      <Link to="/favorits" className="nav-item">
        <img 
          src={isActive('/favorits') ? ICONO_FAVORITOS_ACTIVE : ICONO_FAVORITOS} 
          alt="Favoritos" 
          className="nav-icon" 
        />
      </Link>

    </nav>
  );
}

export default Footer;