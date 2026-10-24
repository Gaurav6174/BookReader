import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    author: {
      type: String,
      trim: true,
      maxlength: [150, 'Author must be at most 150 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);
export default Book;
