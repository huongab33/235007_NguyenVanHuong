const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');

const router = express.Router();
const stringFields = ['bookId', 'title', 'author', 'category', 'publisher', 'isbn', 'description'];
const allFields = [...stringFields, 'publishYear', 'quantity'];
const maxLengths = { bookId: 30, title: 200, author: 150, category: 100, publisher: 150, isbn: 20, description: 2000 };
const validId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

function validateBook(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Du lieu phai la mot JSON object' };
  }
  const extraFields = Object.keys(body).filter((key) => !allFields.includes(key));
  if (extraFields.length) return { error: `Truong khong hop le: ${extraFields.join(', ')}` };

  const data = {};
  for (const field of stringFields) {
    if (typeof body[field] !== 'string' || !body[field].trim()) {
      return { error: `${field} phai la chuoi khong rong` };
    }
    data[field] = body[field].trim();
    if (data[field].length > maxLengths[field]) {
      return { error: `${field} qua dai (toi da ${maxLengths[field]} ky tu)` };
    }
  }
  if (!/^(?:\d{13}|\d{9}[\dX])$/i.test(data.isbn.replace(/-/g, ''))) {
    return { error: 'isbn phai co 10 hoac 13 ky tu hop le (co the co dau -)' };
  }
  if (!Number.isInteger(body.publishYear) || body.publishYear < 1450 || body.publishYear > new Date().getFullYear() + 1) {
    return { error: 'publishYear phai la so nguyen tu 1450 den nam sau' };
  }
  if (!Number.isInteger(body.quantity) || body.quantity < 0) {
    return { error: 'quantity phai la so nguyen khong am' };
  }
  data.publishYear = body.publishYear;
  data.quantity = body.quantity;
  return { data };
}

// Khong cho thao tac CRUD khi ket noi MongoDB bi mat.
router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'MongoDB dang khong san sang' });
  }
  next();
});

// GET /api/books?search=cloud
router.get('/', async (req, res, next) => {
  try {
    const search = req.query.search ?? '';
    if (typeof search !== 'string' || search.length > 100) {
      return res.status(400).json({ message: 'Tu khoa tim kiem khong hop le' });
    }
    const keyword = search.trim();
    const filter = {};
    if (keyword) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { author: { $regex: escaped, $options: 'i' } },
        { category: { $regex: escaped, $options: 'i' } }
      ];
    }
    const books = await Book.find(filter).sort({ createdAt: -1 }).lean();
    res.status(200).json(books);
  } catch (err) { next(err); }
});

// GET /api/books/:id - :id la MongoDB _id, khong phai bookId.
router.get('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'ID khong hop le' });
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Khong tim thay sach' });
    res.status(200).json(book);
  } catch (err) { next(err); }
});

// POST /api/books
router.post('/', async (req, res, next) => {
  try {
    const result = validateBook(req.body);
    if (result.error) return res.status(400).json({ message: result.error });
    const book = await Book.create(result.data);
    res.status(201).json(book);
  } catch (err) { next(err); }
});

// PUT /api/books/:id - yeu cau du 9 truong, khong phai PATCH.
router.put('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'ID khong hop le' });
    const result = validateBook(req.body);
    if (result.error) return res.status(400).json({ message: result.error });
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Khong tim thay sach' });
    book.set(result.data);
    await book.save();
    res.status(200).json(book);
  } catch (err) { next(err); }
});

// DELETE /api/books/:id
router.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'ID khong hop le' });
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Khong tim thay sach' });
    res.status(200).json({ message: 'Xoa sach thanh cong', bookId: book.bookId });
  } catch (err) { next(err); }
});

module.exports = router;
