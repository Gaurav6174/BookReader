import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [1, 'Content must be at least 1 character'],
      maxlength: [5000, 'Content must be at most 5000 characters'],
    },
    pageNumber: {
      type: Number,
      min: [1, 'Page number must be >= 1'],
      default: null,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);
export default Note;
