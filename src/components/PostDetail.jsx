import { useEffect, useState } from "react";
import{useParams, Link} from "react-router-dom";

function PostDetail()
{
    // const {id}= useParams();
    // const [post, setPost]=useSate(null);

    // useEffect(()=> {

    //     fetch('https://pokeapi.co/api/v2/pokemon?limit=200')
    //     .then(res => res.json())
    //     .then(data=> setPost(data));
    // }, [id]);

    // if(!post)return <div>Carregant...</div>;

    return (
        // <div className="post-detail-container">

        // <Link to ="/">Tornar enrere</Link>
        // <h1>{post.title}</h1>
        // <p>{post.body}</p>
        // <p><strong>ID del Post:</strong>{post.id}</p>
        // </div>

        <p>Hola bb</p>
    );
}

export default PostDetail;