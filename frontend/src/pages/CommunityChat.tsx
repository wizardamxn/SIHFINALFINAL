import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  MoreHorizontal, 
  Send, 
  Edit, 
  Trash2, 
  User,
  Clock,
  Heart,
  Reply,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Users,
  TrendingUp
} from 'lucide-react';

// Enhanced data types (keeping your existing interfaces)
interface Comment {
  id: string;
  content: string;
  author: string;
  avatar?: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  replies?: Comment[];
  parentId?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar?: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  category: string;
}

interface UserVotes {
  posts: { [postId: string]: 'up' | 'down' | null };
  comments: { [commentId: string]: 'up' | 'down' | null };
}

// Mock data (keeping your existing data)
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'What are your thoughts on the new React 19 features?',
    content: "I've been exploring the new concurrent features and the improved hooks. The performance improvements seem significant, especially for complex applications. Has anyone tried implementing these in production yet?",
    author: 'DevEnthusiast',
    timestamp: '2 hours ago',
    upvotes: 42,
    downvotes: 3,
    category: 'Technology',
    comments: [
      {
        id: 'c1',
        content: "I've been using the beta version and it's amazing! The automatic batching really helps with performance.",
        author: 'ReactFan',
        timestamp: '1 hour ago',
        upvotes: 15,
        downvotes: 0,
        replies: [
          {
            id: 'c1r1',
            content: "Could you share some specific examples? I'm curious about the implementation details.",
            author: 'CuriousCoder',
            timestamp: '45 minutes ago',
            upvotes: 8,
            downvotes: 0,
            parentId: 'c1'
          }
        ]
      },
      {
        id: 'c2',
        content: 'Still waiting for more stable releases before adopting in production. The breaking changes seem substantial.',
        author: 'CautiousDev',
        timestamp: '30 minutes ago',
        upvotes: 7,
        downvotes: 2
      }
    ]
  },
  {
    id: '2',
    title: 'Best practices for state management in large applications?',
    content: 'Working on a project with multiple teams and we\'re debating between Redux Toolkit, Zustand, and Context API. What has worked best for your team?',
    author: 'TeamLead2024',
    timestamp: '4 hours ago',
    upvotes: 28,
    downvotes: 1,
    category: 'Discussion',
    comments: [
      {
        id: 'c3',
        content: 'Redux Toolkit has been solid for us. The DevTools integration and middleware support are invaluable for debugging.',
        author: 'StateManager',
        timestamp: '3 hours ago',
        upvotes: 12,
        downvotes: 1
      }
    ]
  },
  {
    id: '3',
    title: 'Sharing my weekend project: A TypeScript utility library',
    content: 'Built a small utility library for common TypeScript patterns. It includes type-safe event emitters, async helpers, and validation utilities. Open to feedback!',
    author: 'WeekendHacker',
    timestamp: '6 hours ago',
    upvotes: 67,
    downvotes: 2,
    category: 'Show & Tell',
    comments: []
  }
];

const CommunityChat: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Discussion');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [newReply, setNewReply] = useState<{[key: string]: string}>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [userVotes, setUserVotes] = useState<UserVotes>({ posts: {}, comments: {} });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<{[key: string]: boolean}>({});
  const [currentUser] = useState('CurrentUser');

  // Your existing functions remain the same
  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const validatePost = useCallback((title: string, content: string) => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!content?.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleCreatePost = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validatePost(newPostTitle, newPostContent)) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const post: Post = {
        id: generateId(),
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        author: currentUser,
        timestamp: 'Just now',
        upvotes: 0,
        downvotes: 0,
        comments: [],
        category: newPostCategory
      };

      setPosts(prevPosts => [post, ...prevPosts]);
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPostForm(false);
    } catch (error) {
      setErrors({ submit: 'Failed to create post. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [newPostTitle, newPostContent, newPostCategory, isSubmitting, validatePost, generateId, currentUser]);

  const handleUpdatePost = useCallback((postId: string) => {
    if (!editTitle?.trim() || !editContent?.trim()) return;

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId && post.author === currentUser) {
        return { ...post, title: editTitle.trim(), content: editContent.trim() };
      }
      return post;
    }));
    
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
  }, [editTitle, editContent, currentUser]);

  const handleDeletePost = useCallback((postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post || post.author !== currentUser) return;
    
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  }, [posts, currentUser]);

const handleVotePost = useCallback((postId: string, type: 'up' | 'down') => {
    const currentVote = userVotes.posts[postId];
    
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      
      let newUpvotes = post.upvotes;
      let newDownvotes = post.downvotes;
      
      // Remove previous vote if exists
      if (currentVote === 'up') newUpvotes--;
      if (currentVote === 'down') newDownvotes--;
      
      // If clicking the same vote type, just remove it (unlike/undislike)
      // If clicking different vote type, add the new vote
      if (currentVote !== type) {
        if (type === 'up') newUpvotes++;
        if (type === 'down') newDownvotes++;
      }
      
      return { 
        ...post, 
        upvotes: Math.max(0, newUpvotes),
        downvotes: Math.max(0, newDownvotes)
      };
    }));

    // Update user vote tracking
    setUserVotes(prev => ({
      ...prev,
      posts: { 
        ...prev.posts, 
        [postId]: currentVote === type ? null : type  // Set to null if same vote (unlike), otherwise set new vote
      }
    }));
  }, [userVotes.posts]);

const handleVoteComment = useCallback((postId: string, commentId: string, type: 'up' | 'down') => {
    const currentVote = userVotes.comments[commentId];
    
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      
      const updateCommentVotes = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            let newUpvotes = comment.upvotes;
            let newDownvotes = comment.downvotes;
            
            // Remove previous vote if exists
            if (currentVote === 'up') newUpvotes--;
            if (currentVote === 'down') newDownvotes--;
            
            // If clicking the same vote type, just remove it (unlike/undislike)
            // If clicking different vote type, add the new vote
            if (currentVote !== type) {
              if (type === 'up') newUpvotes++;
              if (type === 'down') newDownvotes++;
            }
            
            return {
              ...comment,
              upvotes: Math.max(0, newUpvotes),
              downvotes: Math.max(0, newDownvotes)
            };
          }
          
          // Check replies
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentVotes(comment.replies)
            };
          }
          
          return comment;
        });
      };
      
      return {
        ...post,
        comments: updateCommentVotes(post.comments)
      };
    }));

    // Update user vote tracking
    setUserVotes(prev => ({
      ...prev,
      comments: { 
        ...prev.comments, 
        [commentId]: currentVote === type ? null : type  // Set to null if same vote (unlike), otherwise set new vote
      }
    }));
  }, [userVotes.comments]);


  const handleAddComment = useCallback((postId: string) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText || commentText.length < 1) return;

    const comment: Comment = {
      id: generateId(),
      content: commentText,
      author: currentUser,
      timestamp: 'Just now',
      upvotes: 0,
      downvotes: 0,
      replies: []
    };

    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...(post.comments || []), comment] }
        : post
    ));

    setNewComment(prev => ({ ...prev, [postId]: '' }));
  }, [newComment, generateId, currentUser]);

  const handleAddReply = useCallback((postId: string, commentId: string) => {
    const replyText = newReply[commentId]?.trim();
    if (!replyText || replyText.length < 1) return;

    const reply: Comment = {
      id: generateId(),
      content: replyText,
      author: currentUser,
      timestamp: 'Just now',
      upvotes: 0,
      downvotes: 0,
      parentId: commentId
    };

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      
      const updateComments = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply]
            };
          }
          
          if (comment.replies) {
            return {
              ...comment,
              replies: updateComments(comment.replies)
            };
          }
          
          return comment;
        });
      };
      
      return {
        ...post,
        comments: updateComments(post.comments)
      };
    }));

    setNewReply(prev => ({ ...prev, [commentId]: '' }));
    setReplyingTo(null);
  }, [newReply, generateId, currentUser]);

  const handleDeleteComment = useCallback((postId: string, commentId: string) => {
    let commentToDelete: Comment | null = null;
    
    const findComment = (comments: Comment[]): Comment | null => {
      for (const comment of comments) {
        if (comment.id === commentId) return comment;
        if (comment.replies) {
          const found = findComment(comment.replies);
          if (found) return found;
        }
      }
      return null;
    };
    
    const post = posts.find(p => p.id === postId);
    if (post) {
      commentToDelete = findComment(post.comments);
    }
    
    if (!commentToDelete || commentToDelete.author !== currentUser) return;
    
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      
      const removeComment = (comments: Comment[]): Comment[] => {
        return comments.filter(comment => {
          if (comment.id === commentId) return false;
          
          if (comment.replies) {
            comment.replies = removeComment(comment.replies);
          }
          
          return true;
        });
      };
      
      return {
        ...post,
        comments: removeComment(post.comments)
      };
    }));
  }, [posts, currentUser]);

  const handleUpdateComment = useCallback((postId: string, commentId: string) => {
    if (!editCommentContent?.trim()) return;
    
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;
      
      const updateComments = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId && comment.author === currentUser) {
            return { ...comment, content: editCommentContent.trim() };
          }
          
          if (comment.replies) {
            return {
              ...comment,
              replies: updateComments(comment.replies)
            };
          }
          
          return comment;
        });
      };
      
      return {
        ...post,
        comments: updateComments(post.comments)
      };
    }));
    
    setEditingComment(null);
    setEditCommentContent('');
  }, [editCommentContent, currentUser]);

  const canEditContent = useCallback((author: string) => {
    return author === currentUser;
  }, [currentUser]);

  const startEditPost = useCallback((post: Post) => {
    if (!canEditContent(post.author)) return;
    setEditingPost(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  }, [canEditContent]);

  const startEditComment = useCallback((comment: Comment) => {
    if (!canEditContent(comment.author)) return;
    setEditingComment(comment.id);
    setEditCommentContent(comment.content);
  }, [canEditContent]);

  const getCategoryColor = useCallback((category: string) => {
    const colors = {
      'Technology': 'from-[#84DCC6] to-[#9ADBE8]',
      'Discussion': 'from-[#9ADBE8] to-[#FFD37D]',
      'Show & Tell': 'from-[#FFD37D] to-[#84DCC6]',
      'Question': 'from-[#FF8A65] to-[#FFD37D]'
    };
    return colors[category as keyof typeof colors] || 'from-[#84DCC6] to-[#9ADBE8]';
  }, []);

  const toggleReplies = useCallback((commentId: string) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  }, []);

  const renderComment = useCallback((comment: Comment, postId: string, depth: number = 0) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedReplies[comment.id];
    const userVotedUp = userVotes.comments[comment.id] === 'up';
    const userVotedDown = userVotes.comments[comment.id] === 'down';
    const canEdit = canEditContent(comment.author);

    return (
      <div key={comment.id} className={`flex gap-3 ${depth > 0 ? 'ml-6 mt-3' : ''}`}>
        <div className="w-8 h-8 bg-gradient-to-br from-[#9ADBE8] to-[#84DCC6] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <User size={16} className="text-[#00373E]" />
        </div>
        <div className="flex-1">
          <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-[#00373E] text-sm">{comment.author}</span>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock size={12} />
                <span>{comment.timestamp}</span>
              </div>
            </div>

            {editingComment === comment.id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateComment(postId, comment.id);
              }} className="space-y-3">
                <textarea
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:border-transparent resize-none bg-white/90 backdrop-blur-sm"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#00373E] to-[#004A56] text-white px-4 py-2 rounded-lg text-sm hover:shadow-md transition-all disabled:opacity-50 font-medium"
                    disabled={!editCommentContent.trim()}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingComment(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-[#2A2A2A] text-sm leading-relaxed">{comment.content}</p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-full px-2 py-1">
              <button 
                onClick={() => handleVoteComment(postId, comment.id, 'up')}
                className={`p-1 rounded-full transition-all ${
                  userVotedUp 
                    ? 'text-green-600 bg-green-100 scale-110' 
                    : 'text-gray-600 hover:bg-green-100 hover:text-green-600'
                }`}
              >
                <ThumbsUp size={12} />
              </button>
              <span className="text-xs text-gray-600 min-w-[1rem] text-center">{comment.upvotes || 0}</span>
              
              <button 
                onClick={() => handleVoteComment(postId, comment.id, 'down')}
                className={`p-1 rounded-full transition-all ${
                  userVotedDown 
                    ? 'text-red-600 bg-red-100 scale-110' 
                    : 'text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <ThumbsDown size={12} />
              </button>
              <span className="text-xs text-gray-600 min-w-[1rem] text-center">{comment.downvotes || 0}</span>
            </div>

            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-[#00373E] hover:text-[#004A56] text-xs flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1 hover:bg-white/80 transition-all font-medium"
            >
              <Reply size={12} />
              Reply
            </button>

            {canEdit && (
              <div className="flex gap-2">
                <button
                  onClick={() => startEditComment(comment)}
                  className="text-[#84DCC6] hover:text-[#6BC4B3] text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteComment(postId, comment.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Delete
                </button>
              </div>
            )}

            {hasReplies && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="text-[#00373E] hover:text-[#004A56] text-xs flex items-center gap-1 bg-gradient-to-r from-[#FFD37D] to-[#84DCC6] text-[#00373E] rounded-full px-3 py-1 hover:shadow-md transition-all font-medium"
              >
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-4 flex gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-[#FFD37D] to-[#84DCC6] rounded-full flex items-center justify-center flex-shrink-0">
                <User size={12} className="text-[#00373E]" />
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newReply[comment.id] || ''}
                  onChange={(e) => setNewReply(prev => ({ ...prev, [comment.id]: e.target.value }))}
                  placeholder="Write a reply..."
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:border-transparent text-sm bg-white/90 backdrop-blur-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddReply(postId, comment.id);
                    }
                  }}
                />
                <button
                  onClick={() => handleAddReply(postId, comment.id)}
                  className="bg-gradient-to-r from-[#00373E] to-[#004A56] text-white p-3 rounded-xl hover:shadow-md transition-all disabled:opacity-50"
                  disabled={!newReply[comment.id]?.trim()}
                  title="Send reply"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Replies */}
          {hasReplies && isExpanded && (
            <div className="mt-4 space-y-3">
              {comment.replies!.map(reply => renderComment(reply, postId, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  }, [expandedReplies, userVotes.comments, canEditContent, editingComment, editCommentContent, replyingTo, newReply, handleVoteComment, startEditComment, handleDeleteComment, handleUpdateComment, handleAddReply, toggleReplies]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDEBD2] via-[#FEF2E1] to-[#FDEBD2]">
      {/* Beautiful Modern Header */}
      <header className="relative overflow-hidden">
        {/* Gradient Background with Glassmorphism Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00373E] via-[#004A56] to-[#00373E] opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#84DCC6]/20 to-transparent rounded-full blur-3xl transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#FFD37D]/20 to-transparent rounded-full blur-3xl transform -translate-x-48 translate-y-48"></div>
        
        <div className="relative z-10 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              {/* Left side - Logo and Title */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#84DCC6] to-[#9ADBE8] rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle size={24} className="text-[#00373E]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Community Chat</h1>
                  <div className="flex items-center gap-4 text-[#84DCC6]/80 text-sm">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>1.2k Members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} />
                      <span>42 Active</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - User info and actions */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FFD37D] to-[#84DCC6] rounded-full flex items-center justify-center">
                    <User size={16} className="text-[#00373E]" />
                  </div>
                  <span className="text-white font-medium">{currentUser}</span>
                </div>
                
                <button
                  onClick={() => setShowNewPostForm(!showNewPostForm)}
                  className={`group relative overflow-hidden bg-gradient-to-r from-[#FFD37D] to-[#84DCC6] text-[#00373E] px-6 py-3 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105 font-semibold flex items-center gap-2 ${showNewPostForm ? 'from-red-400 to-red-500 text-white' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center gap-2">
                    {showNewPostForm ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                          <div className="w-2 h-2 bg-current rounded-full"></div>
                        </div>
                        <span>Cancel</span>
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        <Sparkles size={16} />
                        <span>New Post</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Enhanced New Post Form */}
        {showNewPostForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#84DCC6] via-[#FFD37D] to-[#9ADBE8]"></div>
            
            <h2 className="text-2xl font-bold text-[#00373E] mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#84DCC6] to-[#9ADBE8] rounded-lg flex items-center justify-center">
                <Plus size={18} className="text-[#00373E]" />
              </div>
              Create New Post
            </h2>

            <form onSubmit={handleCreatePost} className="space-y-6">
              <div>
                <label className="block text-[#2A2A2A] font-semibold mb-3">Category</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:border-transparent bg-white/90 backdrop-blur-sm font-medium"
                >
                  <option value="Discussion">💬 Discussion</option>
                  <option value="Technology">🔧 Technology</option>
                  <option value="Show & Tell">🎨 Show & Tell</option>
                  <option value="Question">❓ Question</option>
                </select>
              </div>

              <div>
                <label className="block text-[#2A2A2A] font-semibold mb-3">Title *</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="What's on your mind?"
                  className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:border-transparent bg-white/90 backdrop-blur-sm font-medium ${
                    errors.title ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.title && <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.title}
                </p>}
              </div>

              <div>
                <label className="block text-[#2A2A2A] font-semibold mb-3">Content *</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts, questions, or insights..."
                  rows={5}
                  className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:border-transparent resize-none bg-white/90 backdrop-blur-sm font-medium ${
                    errors.content ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.content && <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.content}
                </p>}
              </div>

              {errors.submit && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{errors.submit}</p>}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !newPostTitle.trim() || !newPostContent.trim()}
                  className="bg-gradient-to-r from-[#00373E] to-[#004A56] hover:from-[#004A56] hover:to-[#006B7A] text-white px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:shadow-lg hover:scale-105 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Post</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPostForm(false);
                    setErrors({});
                    setNewPostTitle('');
                    setNewPostContent('');
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl transition-all font-semibold hover:shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Posts List */}
        <div className="space-y-8">
          {posts.map((post) => {
            const userVotedUp = userVotes.posts[post.id] === 'up';
            const userVotedDown = userVotes.posts[post.id] === 'down';
            const canEdit = canEditContent(post.author);

            return (
              <div key={post.id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300">
                {/* Post Header with Gradient Border */}
                <div className="relative">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getCategoryColor(post.category)}`}></div>
                  
                  <div className="p-6 border-b border-gray-100/60">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#9ADBE8] to-[#84DCC6] rounded-2xl flex items-center justify-center shadow-md">
                          <User size={20} className="text-[#00373E]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#00373E] text-lg">{post.author}</p>
                          <div className="flex items-center gap-3 text-gray-500 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold text-[#00373E] bg-gradient-to-r ${getCategoryColor(post.category)} shadow-md`}>
                          {post.category}
                        </span>
                        <button className="p-2 hover:bg-gray-100/60 rounded-full transition-all">
                          <MoreHorizontal size={18} className="text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {editingPost === post.id ? (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdatePost(post.id);
                      }} className="space-y-4">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:border-transparent bg-white/90 backdrop-blur-sm font-semibold text-lg"
                          required
                        />
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:border-transparent resize-none bg-white/90 backdrop-blur-sm"
                          required
                        />
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-[#00373E] to-[#004A56] text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
                            disabled={!editTitle.trim() || !editContent.trim()}
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPost(null)}
                            className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition-all font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-[#00373E] mb-4 leading-tight">{post.title}</h2>
                        <p className="text-[#2A2A2A] leading-relaxed text-lg">{post.content}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Enhanced Post Actions */}
                <div className="px-6 py-4 border-b border-gray-100/60 bg-gradient-to-r from-white/40 to-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm">
                        <button
                          onClick={() => handleVotePost(post.id, 'up')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                            userVotedUp 
                              ? 'bg-green-100 text-green-700 scale-110 shadow-md' 
                              : 'hover:bg-green-50 text-gray-600 hover:text-green-600'
                          }`}
                        >
                          <ThumbsUp size={18} />
                          <span className="font-bold">{post.upvotes || 0}</span>
                        </button>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <button
                          onClick={() => handleVotePost(post.id, 'down')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                            userVotedDown 
                              ? 'bg-red-100 text-red-700 scale-110 shadow-md' 
                              : 'hover:bg-red-50 text-gray-600 hover:text-red-600'
                          }`}
                        >
                          <ThumbsDown size={18} />
                          <span className="font-bold">{post.downvotes || 0}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[#00373E] bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                        <MessageCircle size={18} />
                        <span className="font-semibold">{(post.comments || []).length} comments</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {canEdit && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditPost(post)}
                            className="p-3 hover:bg-[#84DCC6]/20 rounded-full transition-all group"
                            title="Edit post"
                          >
                            <Edit size={18} className="text-[#84DCC6] group-hover:text-[#6BC4B3]" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-3 hover:bg-red-100 rounded-full transition-all group"
                            title="Delete post"
                          >
                            <Trash2 size={18} className="text-red-500 group-hover:text-red-700" />
                          </button>
                        </div>
                      )}
                      <button className="p-3 hover:bg-gray-100/60 rounded-full transition-all group" title="Share post">
                        <Share2 size={18} className="text-gray-600 group-hover:text-gray-800" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Comments Section */}
                <div className="px-6 py-6">
                  {/* Add Comment */}
                  <div className="mb-6 flex gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFD37D] to-[#84DCC6] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <User size={18} className="text-[#00373E]" />
                    </div>
                    <div className="flex-1 flex gap-3">
                      <input
                        type="text"
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Add a thoughtful comment..."
                        className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84DCC6] focus:border-transparent bg-white/90 backdrop-blur-sm font-medium"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="bg-gradient-to-r from-[#00373E] to-[#004A56] text-white p-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 group"
                        disabled={!newComment[post.id]?.trim()}
                        title="Add comment"
                      >
                        <Send size={18} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {(post.comments || []).map(comment => renderComment(comment, post.id))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
