import { useEffect, useState } from 'react';

import TestimonialCard from '@/components/Testimonail';

export default function TestimonialsSection() {
  const testimonials = [
    {
      sub: "“This AI tutor explains topics in a way that finally makes sense! I went from failing my math tests to scoring above 80% in just two weeks.”",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Jane Lee",
      star: "⭐⭐⭐⭐⭐",
    },
    {
      sub: "“It’s like having the smartest study buddy who never gets tired of my questions.”",
      img: "https://randomuser.me/api/portraits/men/1.jpg",
      name: "Alex Johnson",
      star: "⭐⭐⭐⭐",
    },
    {
      sub: "“This app has completely changed how I study. Learning feels fun and stress-free now.”,",
      img: "https://randomuser.me/api/portraits/women/55.jpg",
      name: "Maria Gomez",
      star: "⭐⭐⭐⭐⭐",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Auto-play every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-4">
      {/* Mobile Carousel */}
      <div className="lg:hidden flex flex-col items-center">
        <div className="transition-all duration-500 ease-in-out w-full flex justify-center">
          <TestimonialCard {...testimonials[currentIndex]} />
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-4">
          {testimonials.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                currentIndex === i ? 'bg-green-600' : 'bg-gray-700'
              }`}
            ></span>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={prevTestimonial}
            className="border border-green-500 px-4 py-2 rounded"
          >
            ← Prev
          </button>
          <button
            onClick={nextTestimonial}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:flex gap-8 justify-center mt-10">
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>
    </section>
  );
}
