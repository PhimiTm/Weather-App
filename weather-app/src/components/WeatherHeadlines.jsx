import { useEffect, useState } from 'react';

const WeatherHeadlines = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
  const GNEWS_URL = `https://gnews.io/api/v4/search?q=weather&lang=en&max=5&token=${API_KEY}`;

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const res = await fetch(GNEWS_URL);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching weather news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeadlines();
  }, []);

  return (
    <div className="mt-10 p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🌦️ Today’s Weather Headlines</h2>
      {loading ? (
        <p>Loading news...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"
            >
              {article.image && (
                <img src={article.image} alt={article.title} className="w-20 h-20 object-cover rounded-md" />
              )}
              <div>
                <h3 className="font-semibold text-sm text-gray-700">{article.title}</h3>
                <p className="text-xs text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherHeadlines;
