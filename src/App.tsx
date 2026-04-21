import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ScenarioPage } from './pages/Scenario';
import { AdminPage } from './pages/admin/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scenario/:id" element={<ScenarioPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center text-slate-500">
            Page not found.{' '}
            <a href="/" className="text-sky-600 ml-1 underline">Go home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
