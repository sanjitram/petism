import express from "express";
import auth from "../middleware/auth.js"; // import auth middleware
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
  likeNote,
  addComment,
  likeComment,
  dislikeComment,
} from "../controllers/notesController.js";

const router = express.Router();

// Protect all note routes
router.use(auth);

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/like", likeNote);
router.post("/:id/comments", addComment);
router.post("/:id/comments/:commentId/like", likeComment);
router.post("/:id/comments/:commentId/dislike", dislikeComment);

export default router;
