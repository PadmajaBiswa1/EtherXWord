import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landingpage from './components/Landingpage';
import NewPresentation from './pages/NewPresentation';
import Favourites from './pages/Favourites';
import History from './pages/History';
import Signup from './pages/Signup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/new" element={<NewPresentation />} />
      <Route path="/favourites" element={<Favourites />} />
      <Route path="/history" element={<History />} />
       <Route path="/Signup" element={<Signup />} />
    
    </Routes>
  );
}

export default App;