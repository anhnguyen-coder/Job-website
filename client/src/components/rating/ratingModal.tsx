import { useState } from "react";
import { Star } from "lucide-react";
import { BaseModal } from "../base/baseModal";
import { toast } from "react-toastify";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workerId: string, rating: number, comment?: string) => void;
  workerId: string;
}

export function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  workerId,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return toast.warning("Please select a rating!");

    onSubmit(workerId, rating, comment);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 py-5 text-center text-white font-semibold text-2xl tracking-wide shadow-md">
          ⭐ Rate Your Experience
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 flex flex-col space-y-6">
          {/* Star rating */}
          <div className="flex flex-col items-center space-y-3">
            <p className="text-slate-700 font-medium text-base">
              How was your experience?
            </p>
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={48}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition-all duration-200 ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)] scale-110"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Comment box */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Your feedback
            </label>
            <textarea
              placeholder="Share more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="w-full border border-slate-200 rounded-2xl p-4 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm resize-none transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md transition-all"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
