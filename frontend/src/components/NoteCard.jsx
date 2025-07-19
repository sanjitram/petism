import { PenSquareIcon, Trash2Icon, ThumbsUpIcon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault();

    // First ask for password
    const password = prompt("Enter petition password to delete:");
    if (!password) return;

    try {
      await api.delete(`/notes/${id}`, {
        data: { password }, // Send password in request body
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Petition deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error(error.response?.data?.message || "Failed to delete petition");
    }
  };

  const handleLike = async (e, id) => {
    e.preventDefault();
    try {
      const res = await api.post(`/notes/${id}/like`);
      setNotes((prev) =>
        prev.map((n) =>
          n._id === id
            ? { ...n, likes: res.data.likes, liked: res.data.liked }
            : n
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like petition");
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
              className={`btn btn-ghost btn-xs flex items-center ${
                note.liked ? "text-primary" : ""
              }`}
              onClick={(e) => handleLike(e, note._id)}
              title={note.liked ? "Already liked" : "Like"}
              disabled={note.liked}
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
