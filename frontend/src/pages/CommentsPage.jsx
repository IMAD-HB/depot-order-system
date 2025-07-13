import React, { useEffect, useState } from "react";
import {
  fetchComments,
  postComment,
  deleteComment,
} from "../services/commentService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Trash2 } from "lucide-react";

dayjs.extend(relativeTime);

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const user = (() => {
    try {
      const stored = localStorage.getItem("user");
      const parsed = JSON.parse(stored);
      return parsed && parsed._id ? parsed : null;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      return null;
    }
  })();

  const loadComments = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchComments();
      setComments(data);
    } catch (err) {
      console.error("Erreur chargement commentaires:", err);
      setError("Erreur lors du chargement des commentaires.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenu.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      await postComment({ contenu });
      setContenu("");
      await loadComments();
    } catch (err) {
      console.error("Erreur ajout commentaire:", err);
      setError("Erreur lors de l'ajout du commentaire.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Erreur suppression commentaire:", err);
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow text-white">
      <h1 className="text-2xl font-bold mb-6">💬 Commentaires</h1>

      {user && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
            placeholder="Votre commentaire..."
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
          >
            {submitting ? "Envoi..." : "Ajouter un commentaire"}
          </button>
        </form>
      )}

      {error && <p className="text-red-400 mb-4">{error}</p>}
      {loading ? (
        <p className="text-white/70">Chargement des commentaires...</p>
      ) : comments.length === 0 ? (
        <p className="text-white/60">Aucun commentaire pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwner =
              user && String(user._id) === String(comment.utilisateur?._id);

            return (
              <div
                key={comment._id}
                className="bg-white/5 border border-white/20 p-4 rounded-lg shadow flex justify-between items-start"
              >
                <div>
                  <p className="text-sm font-semibold text-white/80">
                    {comment.utilisateur?.name || "Utilisateur inconnu"}
                  </p>
                  <p className="text-white">{comment.contenu}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {dayjs(comment.createdAt).fromNow()}
                  </p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    title="Supprimer"
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 ml-4"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">Supprimer</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
