import content from '../content.json';
import * as Icons from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2">{content.about.title}</h1>
        <p className="text-center text-rose-500 font-semibold mb-8 text-lg">{content.about.subtitle}</p>

        <div className="bg-white rounded-lg p-8 shadow-md mb-8">
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">{content.about.description}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">{content.about.mission}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">{content.about.vision}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {content.about.values.map((value, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-rose-500 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Join the ShoesHub Family</h3>
          <p className="text-gray-600 mb-4">Experience premium footwear with exceptional customer service</p>
          <button className="bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 transition">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
