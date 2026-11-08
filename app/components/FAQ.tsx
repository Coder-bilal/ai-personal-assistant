"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How secure is my connected account data?",
      answer: "Aura AI operates on a zero-knowledge local architecture. Your message data and linguistic embeddings are processed directly on your device and are never transmitted to our servers or used to train public LLMs. We secure all local storage with AES-256 encryption."
    },
    {
      question: "Does the AI read all my private chats continuously?",
      answer: "No. Aura only scans for new messages at intervals you define, or when a push notification triggers a local sync. It strictly filters out and drops any content that isn't directly related to tasks, reminders, or professional summaries."
    },
    {
      question: "Can I sync multiple Gmail or Outlook accounts?",
      answer: "Yes, you can connect multiple accounts across all supported platforms. For example, you can connect your personal Gmail, work Outlook, and freelance WhatsApp all into a single unified dashboard."
    },
    {
      question: "Does it support voice messages in WhatsApp or Telegram?",
      answer: "Currently, Aura processes text-based messages and document attachments. Audio transcription for voice messages is on our roadmap and will be rolling out to Professional and Enterprise users next quarter."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 md:py-28 bg-gray-950 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-violet-400">
            QUESTIONS
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h3>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                  isOpen ? "bg-gray-900/60 border-violet-500/30" : "bg-gray-900/20 border-white/5 hover:border-white/10 hover:bg-gray-900/40"
                }`}
                onClick={() => toggleFaq(index)}
              >
                <div className="px-6 py-5 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white pr-8">
                    {faq.question}
                  </h4>
                  <div className={`transform transition-transform duration-200 text-violet-400 shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div 
                  className={`px-6 text-sm text-gray-400 leading-relaxed transition-all duration-300 ${
                    isOpen ? "pb-6 opacity-100 max-h-48" : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
