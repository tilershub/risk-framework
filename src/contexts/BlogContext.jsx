import React, { createContext, useContext, useState, useEffect } from 'react';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

const defaultBlogs = [
  {
    id: '1',
    title: 'Risk Management: The Key to Consistent Profits',
    excerpt: 'Learn how proper risk management can make the difference between profitable and losing traders. Discover the 2% rule and position sizing strategies.',
    content: `# Risk Management: The Key to Consistent Profits

Risk management is the cornerstone of successful trading. Without proper risk management, even the most profitable trading strategy will eventually lead to significant losses.

## The 2% Rule

The 2% rule states that you should never risk more than 2% of your trading capital on a single trade. This simple rule can help preserve your capital during losing streaks.

## Position Sizing

Proper position sizing ensures that you're not overleveraged and can survive multiple consecutive losses. Use our position size calculator to determine the optimal trade size.

## Stop Losses

Always use stop losses to limit your downside risk. A stop loss is your insurance policy against catastrophic losses.`,
    author: 'FXFORECAST Team',
    publishedAt: '2024-03-15',
    readTime: '5 min read',
    status: 'published',
    category: 'Risk Management',
    tags: ['risk', 'management', 'trading', 'strategy']
  },
  {
    id: '2',
    title: 'Technical Analysis: Support and Resistance Levels',
    excerpt: 'Master the art of identifying key support and resistance levels to improve your entry and exit timing in the markets.',
    content: `# Technical Analysis: Support and Resistance Levels

Support and resistance levels are fundamental concepts in technical analysis that every trader should master.

## What are Support and Resistance?

Support levels are price points where buying pressure is expected to overcome selling pressure, causing the price to bounce higher. Resistance levels are the opposite - areas where selling pressure overcomes buying pressure.

## Identifying Key Levels

Look for areas where price has previously reversed multiple times. The more times a level has been tested, the stronger it becomes.

## Trading Strategies

Use support and resistance levels to:
- Identify entry points
- Set profit targets
- Place stop losses
- Determine market bias`,
    author: 'FXFORECAST Team',
    publishedAt: '2024-03-12',
    readTime: '7 min read',
    status: 'published',
    category: 'Technical Analysis',
    tags: ['technical', 'analysis', 'support', 'resistance']
  },
  {
    id: '3',
    title: 'Trading Psychology: Overcoming Emotional Trading',
    excerpt: 'Understand the psychological aspects of trading and learn techniques to maintain discipline and emotional control.',
    content: `# Trading Psychology: Overcoming Emotional Trading

Trading psychology is often overlooked but is crucial for long-term success in the markets.

## Common Emotional Pitfalls

- Fear of missing out (FOMO)
- Revenge trading after losses
- Overconfidence after wins
- Analysis paralysis

## Developing Mental Discipline

1. Create a trading plan and stick to it
2. Keep a trading journal
3. Practice mindfulness and meditation
4. Accept that losses are part of trading

## Building Confidence

Confidence comes from preparation, practice, and consistent execution of your trading plan.`,
    author: 'FXFORECAST Team',
    publishedAt: '2024-03-10',
    readTime: '6 min read',
    status: 'published',
    category: 'Psychology',
    tags: ['psychology', 'emotions', 'discipline', 'mindset']
  }
];

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load blogs from localStorage or use defaults
    const savedBlogs = localStorage.getItem('fxforecast_blogs');
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    } else {
      setBlogs(defaultBlogs);
      localStorage.setItem('fxforecast_blogs', JSON.stringify(defaultBlogs));
    }
    setLoading(false);
  }, []);

  const saveBlogs = (updatedBlogs) => {
    setBlogs(updatedBlogs);
    localStorage.setItem('fxforecast_blogs', JSON.stringify(updatedBlogs));
  };

  const addBlog = (blog) => {
    const newBlog = {
      ...blog,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString().split('T')[0]
    };
    const updatedBlogs = [newBlog, ...blogs];
    saveBlogs(updatedBlogs);
  };

  const updateBlog = (id, updatedBlog) => {
    const updatedBlogs = blogs.map(blog => 
      blog.id === id ? { ...blog, ...updatedBlog } : blog
    );
    saveBlogs(updatedBlogs);
  };

  const deleteBlog = (id) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== id);
    saveBlogs(updatedBlogs);
  };

  const getBlogById = (id) => {
    return blogs.find(blog => blog.id === id);
  };

  const getPublishedBlogs = () => {
    return blogs.filter(blog => blog.status === 'published');
  };

  const value = {
    blogs,
    loading,
    addBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getPublishedBlogs
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};