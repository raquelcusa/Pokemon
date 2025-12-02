import { useEffect, useState } from "react";
import{useParams, Link} from "react-router-dom";
import ICONO_ATRAS from '/src/images/icono_volver/ICONO_ATRAS.svg'
function PostDetail()
{
    const {id}= useParams();
    const [post, setPokemonPost]= useState(null);
    // const [species, setSpecies] = useState(null);
    // const [evolution, setEvolution] = useState([]);

    useEffect(()=> {

        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data=> setPokemonPost(data));
    }, [id]);
 
    if(!post)return <div className="loading">Cargando...</div>;

    return (
        <div className="post-detail-container">

            <Link to="/" className="back-button">
            <img 
                src={ICONO_ATRAS} 
                alt="Descripción de la foto" 
                style={{ width: '48px', height: 'auto' }} 
            />
            </Link>

            <div className="detail-card">

                <img 
                    src={post.sprites.other["official-artwork"].front_default} 
                    alt={post.name} 
                    className="detail-img"
                    style={{ width: '300px', height: 'auto' }} 
                />
                <h1>{post.name}</h1>
                <p><strong>ID:</strong> {post.id}</p>
            
                    <div className="info">
                        <p><strong>PESO:</strong> {post.weight} <p>Kg</p></p>
                        <p><strong>ALTURA: </strong> {post.height} <p>m</p> </p>
                        {/* <p><strong>CATEGORIA:</strong> {post.type}</p>
                        <p><strong>HABILIDAD:</strong> {post.ability}</p> */}
                    </div>

                </div>
        </div>
    );
}

export default PostDetail;