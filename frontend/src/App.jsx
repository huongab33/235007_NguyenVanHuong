import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookList from './pages/BookList';
import BookForm from './pages/BookForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>📚 Quản Lý Sách</h1>
          <p>235007 - Nguyễn Văn Hưởng</p>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/add" element={<BookForm />} />
            <Route path="/edit/:id" element={<BookForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
