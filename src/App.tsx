import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/templates/MainLayout';
import Home from './pages/Home';
import Project from './pages/Project';
import Publications from './pages/Publications';
import PublicationDetails from './pages/PublicationDetails';
import Countries from './pages/Countries';
import CountryDetails from './pages/CountryDetails';
import Team from './pages/Team';
import TeamDetails from './pages/TeamDetails';
import Contact from './pages/Contact';
import SearchPage from './pages/SearchPage';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project" element={<Project />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/publications/:id" element={<PublicationDetails />} />
              <Route path="/countries" element={<Countries />} />
              <Route path="/countries/:id" element={<CountryDetails />} />
              <Route path="/team" element={<Team />} />
              <Route path="/team/:id" element={<TeamDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </MainLayout>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
