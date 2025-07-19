import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [image, setImage] = useState(note?.image || "");
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setImage(res.data.image || "");
      } catch (error) {
        console.log("Error in fetching petition", error);
        toast.error("Failed to fetch the petition");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!deletePassword) {
      toast.error("Please enter the password");
      return;
    }
    try {
      await api.delete(`/notes/${id}`, { data: { password: deletePassword } });
      toast.success("Petition deleted");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete petition ");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }
    if (!password) {
      toast.error("Please enter the petition password");
      return;
    }
    setSaving(true);

    try {
      await api.put(`/notes/${id}`, { ...note, password, image });
      toast.success("Petition updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update petition");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    setCommentLoading(true);
    try {
      const res = await api.post(`/notes/${id}/comments`, { text: commentText });
      setNote((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.data],
      }));
      setCommentText("");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const res = await api.post(`/notes/${id}/comments/${commentId}/like`);
      setNote((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId ? { ...c, likes: res.data.likes } : c
        ),
      }));
    } catch {
      toast.error("Failed to like comment");
    }
  };

  const handleDislikeComment = async (commentId) => {
    try {
      const res = await api.post(`/notes/${id}/comments/${commentId}/dislike`);
      setNote((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId ? { ...c, dislikes: res.data.dislikes } : c
        ),
      }));
    } catch {
      toast.error("Failed to dislike comment");
    }
  };

  const handleLikeNote = async () => {
    try {
      const res = await api.post(`/notes/${id}/like`);
      setNote((prev) => ({
        ...prev,
        likes: res.data.likes,
        liked: res.data.liked
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like petition");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="h-5 w-5" />
              Delete Petition
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              {/* Like button and count */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  className={`btn btn-ghost btn-xs flex items-center ${note.liked ? 'text-primary' : ''}`}
                  onClick={handleLikeNote}
                  title={note.liked ? "Already liked" : "Like"}
                  disabled={note.liked}
                >
                  <ThumbsUpIcon className="size-4" />
                  <span>{note.likes || 0}</span>
                </button>
                <span className="text-xs text-primary font-bold ml-2">
                  {note.likes || 0} Likes
                </span>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Petition title"
                  className="input input-bordered"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write content here..."
                  className="textarea textarea-bordered h-32"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Petition password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Image (optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered"
                  onChange={handleImageChange}
                />
                {image && (
                  <img src={image} alt="Preview" className="mt-2 max-h-40 rounded" />
                )}
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Comments</h3>
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={commentLoading}
              />
              <button
                className="btn btn-primary"
                onClick={handleAddComment}
                disabled={commentLoading}
              >
                {commentLoading ? "Adding..." : "Add"}
              </button>
            </div>
            <div>
              {(note.comments || []).length === 0 && (
                <div className="text-base-content/60">No comments yet.</div>
              )}
              {(note.comments || []).map((c, idx) => (
                <div key={c._id || idx} className="mb-2 p-2 rounded bg-base-200">
                  <div className="text-base-content">{c.text}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="btn btn-ghost btn-xs flex items-center"
                      onClick={() => handleLikeComment(c._id)}
                      title="Like"
                    >
                      <ThumbsUpIcon className="size-4" />
                      <span>{c.likes || 0}</span>
                    </button>
                    <button
                      className="btn btn-ghost btn-xs flex items-center"
                      onClick={() => handleDislikeComment(c._id)}
                      title="Dislike"
                    >
                      <ThumbsDownIcon className="size-4" />
                      <span>{c.dislikes || 0}</span>
                    </button>
                    <span className="text-xs text-base-content/50 ml-2">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-base-100 p-6 rounded shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-bold mb-2">Delete petition</h3>
                <p className="mb-4">Enter the password to confirm deletion:</p>
                <input
                  type="password"
                  className="input input-bordered w-full mb-4"
                  placeholder="Note password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;
