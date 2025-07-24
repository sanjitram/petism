import mongoose from "mongoose";

//create a schema
//create a model based off of that schema

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    creatorEmail: { type: String, required: true }, 
    likes: { type: Number, default: 0 },
    targetLikes: { type: Number, required: true }, 
    isSuccessful: { type: Boolean, default: false }, 
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    password: { type: String, required: true },
    image: { type: String },
    comments: [
      {
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
      },
    ], 
  },
  { timestamps: true } 
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
