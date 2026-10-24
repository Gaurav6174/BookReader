import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BooksPage from './pages/BooksPage.jsx';
import BookPage from './pages/BookPage.jsx';
import ChapterPage from './pages/ChapterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BooksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/books/:bookId" element={<BookPage />} />
        <Route path="/chapters/:chapterId" element={<ChapterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
