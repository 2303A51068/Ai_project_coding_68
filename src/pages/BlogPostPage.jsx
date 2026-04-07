import content from '../content.json';
import { useParams, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams();
  const post = content.blog.find(p => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Blog post not found</h1>
          <Link to="/blog" className="text-rose-500 font-semibold hover:text-rose-600">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = content.blog.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <article className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center text-rose-500 font-semibold mb-6 hover:text-rose-600">
          <Icons.ArrowLeft size={18} className="mr-2" /> Back to Blog
        </Link>

        {/* Post Header */}
        <header className="bg-white rounded-lg p-8 shadow-md mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex justify-between items-center flex-wrap gap-4 pb-6 border-b border-gray-200">
            <div className="flex gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Icons.User size={18} /> {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Icons.Calendar size={18} /> {post.date}
              </span>
            </div>
            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold">
              {post.category}
            </span>
          </div>

          <p className="text-lg text-gray-600 mt-6">{post.excerpt}</p>
        </header>

        {/* Post Content */}
        <div className="bg-white rounded-lg p-8 shadow-md mb-8">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p>{post.content}</p>
            <p className="mt-6">
              This article explores important aspects of footwear selection, care, and trends. Whether you're a casual wearer or a shoe enthusiast, understanding these concepts will enhance your appreciation for quality footwear.
            </p>
            <p className="mt-6">
              At ShoesHub, we're committed to providing not just products, but also knowledge and insights that help you make informed decisions about your footwear choices.
            </p>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`}>
                  <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition cursor-pointer h-full">
                    <span className="bg-rose-100 text-rose-700 text-xs px-2 py-1 rounded inline-block mb-2">
                      {relatedPost.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-2 hover:text-rose-500">{relatedPost.title}</h3>
                    <p className="text-sm text-gray-600">{relatedPost.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Share Section */}
        <div className="bg-white rounded-lg p-8 shadow-md text-center">
          <p className="text-gray-600 mb-4">Found this helpful? Share with others!</p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
              <Icons.Share2 size={18} /> Share
            </button>
            <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition flex items-center gap-2">
              <Icons.Heart size={18} /> Like
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
