import { useEffect, useState } from 'react';


export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  // Show button when scrollY > 300px
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="
        fixed bottom-10 right-10 px-4 py-2 rounded-full bg-blue-600 text-white shadow-lg
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400
        transition-colors duration-300 cursor-pointer
      "
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
