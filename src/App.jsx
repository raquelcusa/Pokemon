import { Routes, Route } from 'react-router-dom';
//import { useState } from 'react'
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import FavoritesPage from './components/FavoritesPage';


function App() {
  return (
    <>
    
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/PostList" element={<PostList/>}/>
        <Route path="/PostDetail/:id" element={<PostDetail/>}/>
        <Route path="/Favorits" element={<FavoritesPage />} />
       </Routes>
      
      <Footer />
    </div>

    
    </>
    
  )
}

export default App
