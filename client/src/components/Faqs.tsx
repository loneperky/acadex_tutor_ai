// components/FaqAccordion.tsx

import { useState } from 'react';
import { Plus, Minus,X } from 'lucide-react';
import { faqs } from '@/data'; // Adjust the import path as necessary

interface FAQ {
  question: string;
  answer: string;
}

export default function FaqAccordion({ question, answer }: FAQ) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-b-gray-700 rounded-xl p-4 mb-4 shadow-sm  transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between gap-2 items-center w-full text-left"
      >
        <span className="font-medium text-x  text-gray-100 dark:text-gray-100">
          {question}
        </span>
        {open ? (
          <X className="w-8 h-8  text-gren-200 " />
        ) : (
          <Plus className="w-8 h-8 text-green-200" />
        )}
      </button>

      {open && (
        <p className="mt-3 text-sm text-gray-100 dark:text-gray-300 leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}


export function FaqSection() {
  return (
    <section className="py-14 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <FaqAccordion key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}