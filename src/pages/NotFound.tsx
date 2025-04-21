
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-casino-black p-4">
      <div className="text-center glass-panel max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-casino-gold">404</h1>
        <p className="text-xl text-white mb-6">Страница не найдена</p>
        <p className="text-gray-400 mb-8">Извините, запрашиваемая страница не существует</p>
        <Link to="/">
          <Button className="slot-button">
            Вернуться на главную
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
