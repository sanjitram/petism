import { PenSquareIcon, Trash2Icon, ThumbsUpIcon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault(); // get rid of the navigation behaviour

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id)); // get rid of the deleted one
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    }
  };

  const handleLike = async (e, id) => {
    e.preventDefault();
    try {
      const res = await api.post(`/notes/${id}/like`);
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? { ...n, likes: res.data.likes } : n))
      );
    } catch (error) {
      toast.error("Failed to like note");
    }
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-t-4 border-solid border-[#00FF9D]"
    >
      <div className="card-body">
        {note.image && (
          <img src={note.image} alt="Note" className="mb-2 max-h-32 rounded" />
        )}
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost btn-xs flex items-center"
              onClick={(e) => handleLike(e, note._id)}
              title="Like"
            >
              <ThumbsUpIcon className="size-4" />
              <span>{note.likes || 0}</span>
            </button>
            {/* Show likes count */}
            <span className="text-xs text-primary font-bold ml-2">
              {note.likes || 0} Likes
            </span>
            <PenSquareIcon className="size-4" />
            <button
              className="btn btn-ghost btn-xs text-error"
              onClick={(e) => handleDelete(e, note._id)}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default NoteCard;
