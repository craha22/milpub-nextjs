import { Shield, Database, Zap, Clock, Search } from 'lucide-react';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Features() {
  const features: FeatureCard[] = [
    {
        title: "Find What You Need",
        description: "AI-powered search engine to help you find the information you need quickly.",
        icon: <Search className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: "Thousands of Documents",
      description: "Backed by a vast library of publically available documents and resources.",
      icon: <Database className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: "Real-Time AI Assistance",
      description: "Powered by Google's Vertex AI for instant, accurate responses to your queries.",
      icon: <Zap className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: "24/7 Availability",
      description: "Access your AI assistant anytime, anywhere, with consistent performance.",
      icon: <Clock className="h-6 w-6 text-emerald-500" />,
    },
  ];

  return (
    <section className="py-20 bg-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Information at Your Fingertips
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Get what you need, when you need it. Our AI-powered platform is designed to help you work faster, smarter, and more efficiently. 
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-700 rounded-lg p-6 hover:bg-zinc-600 transition duration-300"
            >
              <div className="mb-4 inline-block bg-zinc-800 rounded-lg p-3">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}