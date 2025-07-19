import mongoose from "mongoose";

// 1st step: You need to create a schema
// 2nd step: You would create a model based off of that schema

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    targetLikes: { type: Number, required: true }, // Add this line
    isSuccessful: { type: Boolean, default: false }, // Add this line
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Add this line
    password: { type: String, required: true },
    image: { type: String },
    comments: [
      {
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
      },
    ], // <-- add this
  },
  { timestamps: true } // createdAt, updatedAt
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
