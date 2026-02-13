import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownIcon, PenToolIcon, ShareIcon, TrophyIcon } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import ParticlesBackground from "../components/ui/ParticlesBackground";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSuccessful, setShowSuccessful] = useState(false);

  const petitionsRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

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

  const scrollToPetitions = () => {
    petitionsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    <div className="min-h-screen bg-base-200 relative overflow-hidden">
      <Navbar />
      <ParticlesBackground />

      {/* Hero Section */}
      <motion.div
        style={{ opacity, scale }}
        className="h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-4 block">
            Make Your Voice Heard
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-sm leading-tight">
            Create Consensus,<br />Spark Change.
          </h1>
          <p className="text-xl md:text-2xl text-base-content/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            PetISM is a platform where anyone can raise awareness, gather support, and make a difference anonymously.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create"
              className="btn btn-primary btn-lg text-lg px-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Start a Petition
            </Link>
            <button
              onClick={scrollToPetitions}
              className="btn btn-ghost btn-lg text-lg px-8 rounded-full hover:bg-base-300/50"
            >
              Explore Causes
              <ArrowDownIcon className="ml-2 size-5" />
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Steps Section */}
      <div className="py-24 bg-base-100/30 backdrop-blur-md border-y border-base-content/5 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-base-content/60 mt-2">Three simple steps to make an impact.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto"
          >
            <div className="text-center group p-6 rounded-2xl hover:bg-base-200/50 transition-colors">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                <PenToolIcon className="size-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Create</h3>
              <p className="text-base-content/60">Launch a petition for a cause you care about. Tell your story.</p>
            </div>

            <div className="text-center group p-6 rounded-2xl hover:bg-base-200/50 transition-colors">
              <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors group-hover:scale-110 duration-300">
                <ShareIcon className="size-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Gather</h3>
              <p className="text-base-content/60">Share your petition and get signatures from the community.</p>
            </div>

            <div className="text-center group p-6 rounded-2xl hover:bg-base-200/50 transition-colors">
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors group-hover:scale-110 duration-300">
                <TrophyIcon className="size-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Succeed</h3>
              <p className="text-base-content/60">Reach your goal, notify supporters, and celebrate the change.</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div ref={petitionsRef} className="container mx-auto px-4 py-16 relative z-10 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-base-content to-base-content/60 bg-clip-text text-transparent">
              Active Petitions
            </h2>
            <p className="text-base-content/60 mt-2">Join the movement. Sign petitions that matter to you.</p>
          </div>

          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              className="input input-bordered w-full md:w-64 bg-base-100/50 backdrop-blur-sm focus:bg-base-100 transition-colors"
              placeholder="Search causes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className={`btn ${showSuccessful ? "btn-primary" : "btn-outline"} whitespace-nowrap`}
              onClick={() => setShowSuccessful(!showSuccessful)}
            >
              {showSuccessful ? "Show All" : "Successful Only"}
            </button>
          </div>
        </div>

        {isRateLimited && <RateLimitedUI />}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/60">Loading petitions...</p>
          </div>
        )}

        {filteredNotes.length === 0 && !loading && !isRateLimited && <NotesNotFound />}

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
