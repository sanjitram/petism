import Note from "../models/Note.js";

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // -1 will sort in desc. order (newest first)
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found!" });
    res.json(note);
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, password, image, targetLikes, creatorEmail } = req.body;
    if (!password) return res.status(400).json({ message: "Password is required" });
    if (!targetLikes) return res.status(400).json({ message: "Target likes is required" });
    if (!creatorEmail) return res.status(400).json({ message: "Creator email is required" });

    const note = new Note({ 
      title, 
      content, 
      password, 
      image,
      targetLikes: parseInt(targetLikes),
      isSuccessful: false,
      creatorEmail
    });
    
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content, password, image } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (!password || password !== note.password) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    note.title = title;
    note.content = content;
    note.image = image; // <-- update image
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const { password } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (!password || password !== note.password) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function likeNote(req, res) {
  try {
    const userId = req.user.id;
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You've already liked this petition" });
    }

    // Add user to likedBy array and increment likes
    note.likedBy.push(userId);
    note.likes += 1;

    // Check if target reached
    if (note.likes >= note.targetLikes && !note.isSuccessful) {
      note.isSuccessful = true;
    }

    await note.save();

    // Send email notification to creator
    if (note.creatorEmail) {
      await sendLikesUpdateEmail(note.creatorEmail, note);
    }

    res.status(200).json({ 
      likes: note.likes, 
      liked: true,
      isSuccessful: note.isSuccessful,
      targetLikes: note.targetLikes 
    });
  } catch (error) {
    console.error("Error in likeNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addComment(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.comments.push({ text });
    await note.save();

    res.status(201).json(note.comments[note.comments.length - 1]);
  } catch (error) {
    console.error("Error in addComment controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function likeComment(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const comment = note.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.likes = (comment.likes || 0) + 1;
    await note.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function dislikeComment(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const comment = note.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.dislikes = (comment.dislikes || 0) + 1;
    await note.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
