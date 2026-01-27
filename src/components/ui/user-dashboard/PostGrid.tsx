import React from 'react';

interface Post {
  id: string;
  author: string;
  date: string;
  title: string;
  description: string;
  category: 'NFT' | 'BTC' | 'ALT';
  image: string;
}

interface PostsGridProps {
  posts: Post[];
  onReadPost: (postId: string) => void;
}

function PostsGrid({ posts, onReadPost }: PostsGridProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent posts</h2>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0" style={{background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)'}} />
              
              {/* Author, Date and Category */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm font-semibold drop-shadow-lg mb-1">{post.author}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs opacity-90 drop-shadow-lg">{post.date}</p>
                  <span className="text-xs font-semibold text-white drop-shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                {post.description}
              </p>
              <button
                onClick={() => onReadPost(post.id)}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-semibold flex items-center space-x-2 transition-all duration-200 group"
              >
                <span>Read post</span>
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostsGrid;