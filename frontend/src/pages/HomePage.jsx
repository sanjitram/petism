import { useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import { useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSuccessful, setShowSuccessful] = useState(false); // Add this state

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load petitions");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Filter notes based on search and successful status
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());

    if (showSuccessful) {
      return matchesSearch && note.isSuccessful;
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {/* Search and filter controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="text"
            className="input input-bordered w-full max-w-md"
            placeholder="Search petitions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className={`btn ${
              showSuccessful ? "btn-primary" : "btn-outline"
            } whitespace-nowrap`}
            onClick={() => setShowSuccessful(!showSuccessful)}
          >
            {showSuccessful
              ? "All Petitions"
              : "Successful petitions"}
          </button>
        </div>

        {loading && (
          <div className="text-center text-primary py-10">
            Loading petitions...
          </div>
        )}

        {filteredNotes.length === 0 && !isRateLimited && <NotesNotFound />}

        {filteredNotes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
