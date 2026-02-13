import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, ThumbsUpIcon, ThumbsDownIcon, Edit2Icon, SaveIcon, XIcon, LockIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        setEditTitle(res.data.title);
        setEditContent(res.data.content);
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
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Please add a title or content");
      return;
    }
    if (!password) {
      toast.error("Please enter the petition password to save changes");
      return;
    }
    setSaving(true);

    try {
      await api.put(`/notes/${id}`, {
        title: editTitle,
        content: editContent,
        password,
        image
      });

      setNote(prev => ({ ...prev, title: editTitle, content: editContent, image }));
      setIsEditing(false);
      setPassword(""); // Clear password after save
      toast.success("Petition updated successfully");
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
    // Add size validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size too large (max 5MB)");
      return;
    }
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
        liked: res.data.liked,
        isSuccessful: res.data.isSuccessful
      }));

      if (res.data.isSuccessful && !note.isSuccessful) {
        toast.success("🎉 Goal Reached! Victory!", { duration: 5000 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like petition");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost hover:bg-base-300">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Petitions
            </Link>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-ghost text-primary hover:bg-primary/10"
              >
                <Edit2Icon className="h-4 w-4 mr-2" />
                Edit Petition
              </button>
            )}
          </div>

          <div className="card bg-base-100 shadow-xl overflow-hidden relative">
            {/* Main Content */}
            <div className="card-body p-8">

              {/* 1. View Mode */}
              {!isEditing ? (
                <div className="space-y-6">
                  {/* Status Badge */}
                  {note.isSuccessful && (
                    <div className="alert alert-success shadow-sm border-none bg-success/10 text-success-content">
                      <span>🎉 <strong>Victory!</strong> This petition has reached its goal of {note.targetLikes} signatures!</span>
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-4xl font-extrabold leading-tight">{note.title}</h1>

                  {/* Stats & Progress */}
                  <div className="bg-base-200/50 p-6 rounded-2xl">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-3xl font-bold text-primary">{note.likes}</span>
                        <span className="text-base-content/60 ml-2">signatures</span>
                      </div>
                      <span className="text-sm font-medium text-base-content/60">Goal: {note.targetLikes}</span>
                    </div>
                    <progress
                      className={`progress w-full h-3 ${note.isSuccessful ? 'progress-success' : 'progress-primary'}`}
                      value={note.likes}
                      max={note.targetLikes}
                    />

                    <div className="mt-4">
                      <button
                        className={`btn ${note.liked ? 'btn-disabled opacity-50' : 'btn-primary'} w-full sm:w-auto gap-2 rounded-full`}
                        onClick={handleLikeNote}
                        disabled={note.liked}
                      >
                        <ThumbsUpIcon className={`size-5 ${note.liked ? 'fill-current' : ''}`} />
                        {note.liked ? "Signed" : "Sign this Petition"}
                      </button>
                    </div>
                  </div>

                  {/* Image */}
                  {image && (
                    <div className="rounded-2xl overflow-hidden shadow-sm">
                      <img src={image} alt={note.title} className="w-full h-auto object-cover max-h-[500px]" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose prose-lg max-w-none text-base-content/80 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </div>

                  <div className="divider"></div>

                  {/* Comments */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      Discussion
                      <span className="badge badge-neutral badge-md">{(note.comments || []).length}</span>
                    </h3>

                    <div className="flex gap-3 mb-6">
                      <input
                        type="text"
                        className="input input-bordered flex-1 rounded-full px-6"
                        placeholder="Add your voice..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={commentLoading}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <button
                        className="btn btn-circle btn-primary"
                        onClick={handleAddComment}
                        disabled={commentLoading}
                      >
                        {commentLoading ? <LoaderIcon className="animate-spin size-4" /> : <ArrowLeftIcon className="rotate-90 size-5" />}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(note.comments || []).length === 0 && (
                        <div className="text-center py-8 text-base-content/40 bg-base-200/30 rounded-xl">
                          No comments yet. Be the first to start the conversation!
                        </div>
                      )}
                      {(note.comments || []).map((c, idx) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={c._id || idx}
                          className="p-4 rounded-xl bg-base-200/40 hover:bg-base-200/60 transition-colors"
                        >
                          <div className="text-base-content leading-relaxed">{c.text}</div>
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-base-content/5">
                            <span className="text-xs text-base-content/40">
                              {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Just now"}
                            </span>
                            <div className="flex gap-2 ml-auto">
                              <button
                                className="btn btn-ghost btn-xs gap-1 hover:text-success"
                                onClick={() => handleLikeComment(c._id)}
                              >
                                <ThumbsUpIcon className="size-3" />
                                <span>{c.likes || 0}</span>
                              </button>
                              <button
                                className="btn btn-ghost btn-xs gap-1 hover:text-error"
                                onClick={() => handleDislikeComment(c._id)}
                              >
                                <ThumbsDownIcon className="size-3" />
                                <span>{c.dislikes || 0}</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // 2. Edit Mode
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-base-content/10">
                    <h2 className="text-2xl font-bold">Edit Petition</h2>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn btn-ghost btn-sm btn-circle"
                    >
                      <XIcon className="size-5" />
                    </button>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Title</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered text-lg font-bold"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-64 text-base leading-relaxed"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Update Image</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={handleImageChange}
                    />
                    {image && (
                      <div className="mt-4 relative group w-fit">
                        <img src={image} alt="Preview" className="max-h-40 rounded-lg border border-base-content/10" />
                        <button
                          onClick={() => setImage("")}
                          className="btn btn-xs btn-circle btn-error absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Security Confirmation */}
                  <div className="bg-warning/10 p-4 rounded-xl border border-warning/20">
                    <div className="flex items-start gap-3">
                      <LockIcon className="size-5 text-warning mt-1 shrink-0" />
                      <div className="w-full">
                        <h4 className="font-bold text-warning-content text-sm mb-2">Security Check</h4>
                        <input
                          type="password"
                          placeholder="Enter petition password to save changes"
                          className="input input-bordered w-full input-sm"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="btn btn-ghost text-error hover:bg-error/10"
                    >
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Delete Petition
                    </button>

                    <div className="flex gap-3">
                      <button
                        className="btn btn-ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        disabled={saving}
                        onClick={handleSave}
                      >
                        {saving ? <LoaderIcon className="animate-spin size-4 mr-2" /> : <SaveIcon className="size-4 mr-2" />}
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-base-100 p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-base-content/5"
              >
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-error">
                  <Trash2Icon className="size-5" />
                  Delete petition?
                </h3>
                <p className="mb-6 text-base-content/60">This action cannot be undone. Enter the password to confirm.</p>
                <input
                  type="password"
                  className="input input-bordered w-full mb-6"
                  placeholder="Petition password"
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
                    Confirm Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;
