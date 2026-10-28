import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { bookApi } from '../api';

const emptyBook = {
  bookId: '',
  title: '',
  author: '',
  category: '',
  publisher: '',
  publishYear: '',
  isbn: '',
  quantity: '',
  description: '',
};

function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyBook);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        setLoading(true);
        const res = await bookApi.getById(id);
        const b = res.data;
        setForm({
          bookId: b.bookId || '',
          title: b.title || '',
          author: b.author || '',
          category: b.category || '',
          publisher: b.publisher || '',
          publishYear: b.publishYear ?? '',
          isbn: b.isbn || '',
          quantity: b.quantity ?? '',
          description: b.description || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Không tải được thông tin sách');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...form,
      publishYear: Number(form.publishYear),
      quantity: Number(form.quantity),
    };

    try {
      setSaving(true);
      if (isEdit) {
        await bookApi.update(id, payload);
      } else {
        await bookApi.create(payload);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu sách thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">⏳ Đang tải...</div>;

  return (
    <div className="form-container">
      <h2>{isEdit ? '✏️ Chỉnh sửa sách' : '➕ Thêm sách mới'}</h2>

      {error && <div className="message message-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Mã sách *</label>
            <input
              name="bookId"
              value={form.bookId}
              onChange={handleChange}
              placeholder="VD: B004"
              maxLength={30}
              required
            />
          </div>

          <div className="form-group">
            <label>ISBN *</label>
            <input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              placeholder="VD: 978-0-13-468599-1"
              maxLength={20}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Tên sách *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Nhập tên sách"
              maxLength={200}
              required
            />
          </div>

          <div className="form-group">
            <label>Tác giả *</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Nhập tên tác giả"
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label>Thể loại *</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="VD: Công nghệ"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label>Nhà xuất bản *</label>
            <input
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              placeholder="Nhập NXB"
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label>Năm xuất bản *</label>
            <input
              name="publishYear"
              type="number"
              value={form.publishYear}
              onChange={handleChange}
              placeholder="VD: 2023"
              min={1450}
              max={new Date().getFullYear() + 1}
              required
            />
          </div>

          <div className="form-group">
            <label>Số lượng *</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              placeholder="VD: 10"
              min={0}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Mô tả *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sách"
              maxLength={2000}
              rows={3}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <Link to="/" className="btn btn-secondary">← Quay lại</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? '⏳ Đang lưu...' : (isEdit ? '💾 Cập nhật' : '💾 Thêm sách')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;

