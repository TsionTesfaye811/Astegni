/* oxlint-disable react/only-export-components -- provider and hook are intentionally colocated */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface Review {
  id: string;
  name: string;
  grade: string;
  text: string;
  rating: number;
  avatar?: string;
}

const REVIEWS_KEY = "astegni_reviews";
const SEED_REVIEWS: Review[] = [
  { id: "seed-1", name: "Selamawit Tesfaye", grade: "Grade 12, Addis Ababa", text: "Astegni helped me go from failing Physics to scoring 91% in my national exam. The video explanations are incredibly clear.", rating: 5, avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&auto=format" },
  { id: "seed-2", name: "Dawit Mengistu", grade: "Grade 11, Bahir Dar", text: "I love how I can study at my own pace. The practice tests feel exactly like the real exams. I feel so much more confident now.", rating: 5, avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&auto=format" },
  { id: "seed-3", name: "Hiwot Bekele", grade: "Grade 10, Hawassa", text: "Having lessons in both Amharic and English is a game changer. I finally understand concepts I struggled with for years.", rating: 5, avatar: "https://images.unsplash.com/photo-1520810627419-35e592be37f3?w=80&h=80&fit=crop&auto=format" },
];

interface ReviewsContextValue {
  reviews: Review[];
  addReview: (review: Omit<Review, "id">) => void;
}

const ReviewsContext = createContext<ReviewsContextValue | null>(null);

function readReviews() {
  try {
    const stored = localStorage.getItem(REVIEWS_KEY);
    return stored ? JSON.parse(stored) as Review[] : SEED_REVIEWS;
  } catch {
    return SEED_REVIEWS;
  }
}

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(readReviews);
  const value = useMemo(() => ({
    reviews,
    addReview: (review: Omit<Review, "id">) => {
      setReviews(current => {
        const next = [...current, { ...review, id: crypto.randomUUID() }];
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
        return next;
      });
    },
  }), [reviews]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be used inside ReviewsProvider");
  return context;
}
