import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import CakesList from './pages/CakesList';
import CakeDetail from './pages/CakeDetail';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/category/cakes" element={<CakesList />} />
          <Route path="/cake/:id" element={<CakeDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
