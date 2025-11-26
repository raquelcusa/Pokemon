import { useEffect, useState } from "react";
import{useParams, Link} from "react-router-dom";

function PostDetail()
{
    const {id}= useParams();
    const [post, setPokemonPost]= useState(null);
    const [species, setSpecies] = useState(null);
    const [evolution, setEvolution] = useState([]);

    useEffect(()=> {

        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data=> setPokemonPost(data));
    }, [id]);
 
    if(!post)return <div className="loading">Cargando...</div>;

    return (
        <div className="post-detail-container">

            <Link to="/" className="back-button">← Volver</Link>

            <div className="detail-card">

                <img 
                    src={post.sprites.other["official-artwork"].front_default} 
                    alt={post.name} 
                    className="detail-img"
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