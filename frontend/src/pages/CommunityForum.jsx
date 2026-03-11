import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, MessageSquare, ThumbsUp, Send, Search, Filter, TrendingUp } from 'lucide-react';

export default function CommunityForum() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);

    // Load mock posts
    const mockPosts = [
      {
        id: 1,
        author: 'Rajesh Kumar',
        title: t('forum.post1Title'),
        content: t('forum.post1Content'),
        category: 'pest',
        likes: 12,
        replies: 5,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        author: 'Priya Sharma',
        title: t('forum.post2Title'),
        content: t('forum.post2Content'),
        category: 'irrigation',
        likes: 8,
        replies: 3,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        author: 'Suresh Patel',
        title: t('forum.post3Title'),
        content: t('forum.post3Content'),
        category: 'market',
        likes: 15,
        replies: 7,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const savedPosts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    setPosts([...mockPosts, ...savedPosts]);
  }, [t]);

  const handlePostSubmit = () => {
    if (!newPost.title || !newPost.content) return;

    const post = {
      id: Date.now(),
      author: currentUser?.name || 'Anonymous',
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      likes: 0,
      replies: 0,
      timestamp: new Date().toISOString()
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    
    const savedPosts = updatedPosts.filter(p => p.id >= 1000);
    localStorage.setItem('forumPosts', JSON.stringify(savedPosts));

    setNewPost({ title: '', content: '', category: 'general' });
  };

  const handleLike = (postId) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      pest: 'bg-red-100 text-red-700',
      irrigation: 'bg-blue-100 text-blue-700',
      market: 'bg-green-100 text-green-700',
      crop: 'bg-yellow-100 text-yellow-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.general;
  };

  const filteredPosts = posts
    .filter(p => filter === 'all' || p.category === filter)
    .filter(p => 
      searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Users className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('forum.title')}</h1>
            <p className="text-gray-600">{t('forum.subtitle')}</p>
          </div>
        </div>

        {/* Create Post */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t('forum.createPost')}</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder={t('forum.postTitle')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder={t('forum.postContent')}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center space-x-4">
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="general">{t('forum.general')}</option>
                <option value="pest">{t('forum.pest')}</option>
                <option value="irrigation">{t('forum.irrigation')}</option>
                <option value="market">{t('forum.market')}</option>
                <option value="crop">{t('forum.crop')}</option>
              </select>
              <button
                onClick={handlePostSubmit}
                disabled={!newPost.title || !newPost.content}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{t('forum.post')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('forum.search')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{t('forum.allCategories')}</option>
              <option value="general">{t('forum.general')}</option>
              <option value="pest">{t('forum.pest')}</option>
              <option value="irrigation">{t('forum.irrigation')}</option>
              <option value="market">{t('forum.market')}</option>
              <option value="crop">{t('forum.crop')}</option>
            </select>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t('forum.noPosts')}</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{post.author}</h4>
                      <p className="text-sm text-gray-500">{getTimeAgo(post.timestamp)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replies} {t('forum.replies')}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
