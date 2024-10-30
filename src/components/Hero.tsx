import Link from 'next/link';
import { Shield, ChevronRight } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative bg-zinc-900 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Shield className="h-16 w-16 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Milpub
                    </h1>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
                            AI Powered Military Pub Search
                        </h2>
                    </div>

                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Work faster, smarter, and more efficient.<br />
                        Search through thousands of military publications with the power of AI.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                        >
                            Get Started
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
} 