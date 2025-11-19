import { useState } from 'react'
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';

function App() {
  return (
    <>
    
    <div className="App">
      <Header />
      <PostList/>
      <Footer />
    </div>

    
    </>
    
  )
}

export default App
