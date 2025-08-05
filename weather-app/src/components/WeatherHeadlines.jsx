import { useEffect, useState } from 'react';

const WeatherHeadlines = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
  const GNEWS_URL = `https://gnews.io/api/v4/search?q=weather&lang=en&max=5&token=${API_KEY}`;

  useEffect(() => {
  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=weather&lang=en&country=za&max=5&apikey=${import.meta.env.VITE_GNEWS_API_KEY}`
      );
      const data = await response.json();
      console.log("Fetched news:", data); // 👉 ADD THIS LINE
      setArticles(data.articles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setLoading(false);
    }
  };

  fetchNews();
}, []);



  return (
    <div className="mt-8">
  <h2 className="text-2xl font-semibold mb-4 dark:text-white">🌦️ Today’s Weather Headlines</h2>
  {loading ? (
    <p>Loading news...</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article, index) => (
        <a
          key={index}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold dark:text-white">{article.title}</h3>
            <p className="text-sm text-gray-600 dark:text-white mt-2 line-clamp-3">
              {article.description}
            </p>
          </div>
        </a>
      ))}
    </div>
  )}
</div>

  );
};

export default WeatherHeadlines;
