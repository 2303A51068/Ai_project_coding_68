import content from '../content.json';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2">ShoesHub Blog</h1>
        <p className="text-center text-gray-600 mb-8 text-lg">Discover tips, trends, and insights about footwear</p>

        <div className="space-y-6">
          {content.blog.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-bold text-gray-900 flex-1">{post.title}</h2>
                  <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full whitespace-nowrap ml-4 font-semibold">
                    {post.category}
                  </span>
                </div>
                
                <div className="flex gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Icons.User size={16} /> {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icons.Calendar size={16} /> {post.date}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{post.excerpt}</p>

                <div className="flex items-center text-rose-500 font-semibold">
                  Read Full Article <Icons.ArrowRight size={18} className="ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg p-8 shadow-md text-center">
          <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
          <p className="text-gray-600 mb-4">Get the latest footwear trends and exclusive offers</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
            <button className="bg-rose-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-600 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
