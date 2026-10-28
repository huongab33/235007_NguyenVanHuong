const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    bookId: { type: String, required: true, trim: true, unique: true, maxlength: 30 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    author: { type: String, required: true, trim: true, maxlength: 150 },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    publisher: { type: String, required: true, trim: true, maxlength: 150 },
    publishYear: {
      type: Number,
      required: true,
      min: 1450,
      max: new Date().getFullYear() + 1,
      validate: { validator: Number.isInteger, message: 'publishYear phai la so nguyen' }
    },
    isbn: { type: String, required: true, trim: true, maxlength: 20 },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      validate: { validator: Number.isInteger, message: 'quantity phai la so nguyen' }
    },
    description: { type: String, required: true, trim: true, maxlength: 2000 }
  },
  { collection: 'books', timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
