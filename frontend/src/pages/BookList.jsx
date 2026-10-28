import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookApi } from '../api';

function BookList() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchBooks = useCallback(async (keyword = '') => {
    try {
      setLoading(true);
      setError('');
      const res = await bookApi.getAll(keyword);
      setBooks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await bookApi.delete(deleteTarget._id);
      setSuccess(`Đã xóa sách "${deleteTarget.title}" thành công!`);
      setDeleteTarget(null);
      fetchBooks(search);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Xóa sách thất bại');
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      {error && <div className="message message-error">{error}</div>}
      {success && <div className="message message-success">{success}</div>}

      <div className="toolbar">
        <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, gap: '8px' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo tên sách, tác giả, thể loại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">🔍 Tìm</button>
        </form>
        <Link to="/add" className="btn btn-success">➕ Thêm sách</Link>
      </div>

      {loading ? (
        <div className="loading">⏳ Đang tải...</div>
      ) : books.length === 0 ? (
        <div className="empty">
          <p>📭 Không tìm thấy sách nào</p>
        </div>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th>Năm XB</th>
              <th>Số lượng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.bookId}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.publishYear}</td>
                <td>{book.quantity}</td>
                <td>
                  <div className="actions">
                    <Link to={`/edit/${book._id}`} className="btn btn-warning btn-sm">✏️ Sửa</Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteTarget(book)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Xác nhận xóa</h3>
            <p>
              Bạn có chắc muốn xóa sách <strong>"{deleteTarget.title}"</strong> (Mã: {deleteTarget.bookId})?
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Hủy</button>
              <button className="btn btn-danger" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookList;

