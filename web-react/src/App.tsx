import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { DishDetailPage } from './pages/DishDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/dishdetail/:id" element={<DishDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contactus" element={<ContactPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
