import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Chapter = mongoose.model('Chapter', chapterSchema);
export default Chapter;
