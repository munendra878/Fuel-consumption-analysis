import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";

function Feedback() {
  const { user } = useUser();
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  /* Load feedbacks */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("feedbacks")) || [];
    setFeedbacks(saved);
  }, []);

  /* Save feedback */
  const submitFeedback = () => {
    if (!comment.trim()) return;

    const newFeedback = {
      id: Date.now(),
      name: user?.fullName || "Anonymous",
      comment,
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem("feedbacks", JSON.stringify(updated));
    setComment("");
  };

  /* Delete feedback */
  const deleteFeedback = (id) => {
    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem("feedbacks", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen pt-28 px-6 max-w-3xl mx-auto text-white">

      <h1 className="text-3xl font-bold mb-6">User Feedback</h1>

      <SignedIn>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full p-3 rounded-lg text-black mb-4"
        />

        <button
          onClick={submitFeedback}
          className="bg-indigo-600 px-6 py-2 rounded-lg"
        >
          Submit Feedback
        </button>
      </SignedIn>

      <SignedOut>
        <p className="text-gray-300">Please login to give feedback.</p>
      </SignedOut>

      {/* FEEDBACK LIST */}
      <div className="mt-10 space-y-4">
        {feedbacks.map((f) => (
          <div
            key={f.id}
            className="bg-white text-black p-4 rounded-xl shadow"
          >
            <p>"{f.comment}"</p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold">{f.name}</span>
              <button
                onClick={() => deleteFeedback(f.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Feedback;
