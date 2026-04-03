import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landingpage.css';
import axios from "axios";

function Landingpage() {
  const navigate = useNavigate();

  // ✅ function to call backend
  const handleCreatePresentation = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/presentations/new",
        { title: "Test Presentation" }
      );

      console.log(res.data);

      // redirect after creation
      navigate('/new');

    } catch (error) {
      console.error("Error creating presentation:", error);
    }
  };

  return (
    <div className="landing-container">
      <header>
        <div className="logo">ETHERX WORD</div>

        <div className="nav-buttons">
          {/* ✅ FIXED BUTTONS */}
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </header>

      <main>
        <h1>
          <span className="highlight">Create Amazing</span> documentations
        </h1>

        <p>
          Professional word-like editor with real-time collaboration,
          modern design tools, and seamless workflow.
        </p>

        <div className="main-buttons">
          <button onClick={handleCreatePresentation}>
            Get Started Free
          </button>

          <button onClick={() => alert('Demo feature coming soon')}>
            Try Demo
          </button>
        </div>

        <div className="cards">
          <div className="card" onClick={handleCreatePresentation}>
            <h3>New Presentation</h3>
            <p>Create and open a new presentation instantly.</p>
          </div>

          <div className="card" onClick={() => navigate('/favourites')}>
            <h3>Favourites</h3>
            <p>Sign in to access favourites.</p>
          </div>

          <div className="card" onClick={() => navigate('/history')}>
            <h3>History</h3>
            <p>Sign in to access history.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landingpage;