"use client";

import { useState } from 'react';
import { MessageSquare, Check } from 'lucide-react';
import Link from 'next/link';

export default function DemoPreview() {
  const [messages] = useState([
    {
      role: 'user',
      content: 'How much time off for paternity leave?'
    },
    {
      role: 'assistant',
      content: 'Soldiers may receive 10 days of non-chargeable parental leave (also known as paternity leave), or up to 21 days of non-chargeable adoption leave...'
    }
  ]);

  const features = [
    "Instant answers to military publication search",
    "AI-Synthesized responses with citations",
    "Links to official military publications",
    "Supports all publically available documents",
    "Ongoing updates and improvements",
  ];

  return (
    <section className="py-20 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Experience the Power of AI Search
            </h2>
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#demos"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
            >
              Try Demo
              <MessageSquare className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg p-4 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-700 text-gray-300'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
