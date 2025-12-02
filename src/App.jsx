import { Routes, Route } from 'react-router-dom';
//import { useState } from 'react'
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';

function App() {
  return (
    <>
    
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<PostList/>}/>
        <Route path="/PostDetail/:id" element={<PostDetail/>}/>
       </Routes>
      
      <Footer />
    </div>

    
    </>
    
  )
}

export default App
