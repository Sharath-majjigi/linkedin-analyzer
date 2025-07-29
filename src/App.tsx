import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import ClientView from './pages/ClientView';
import './App.css';

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/client/:id" element={<ClientView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 