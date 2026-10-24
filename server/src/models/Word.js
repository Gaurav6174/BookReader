import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema(
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
    word: {
      type: String,
      required: [true, 'Word is required'],
      trim: true,
      minlength: [1, 'Word must be at least 1 character'],
      maxlength: [100, 'Word must be at most 100 characters'],
    },
    // Hidden lowercase version for duplicate detection
    wordLower: {
      type: String,
      required: true,
    },
    meaning: {
      type: String,
      required: [true, 'Meaning is required'],
      trim: true,
      minlength: [1, 'Meaning must be at least 1 character'],
      maxlength: [1000, 'Meaning must be at most 1000 characters'],
    },
    exampleSentence: {
      type: String,
      trim: true,
      maxlength: [500, 'Example sentence must be at most 500 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

// Compound unique index: one word (case-insensitive) per chapter
wordSchema.index({ chapterId: 1, wordLower: 1 }, { unique: true });

// Auto-populate wordLower before validation
wordSchema.pre('validate', function (next) {
  if (this.word) {
    this.wordLower = this.word.trim().toLowerCase();
  }
  next();
});

wordSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.word) {
    update.wordLower = update.word.trim().toLowerCase();
  }
  next();
});

const Word = mongoose.model('Word', wordSchema);
export default Word;
