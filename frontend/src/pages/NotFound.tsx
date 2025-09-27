import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6F4] px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-6xl font-extrabold text-[#00373E]">404</h1>
        <p className="mt-4 text-lg text-gray-700">The page you’re looking for doesn’t exist.</p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link to="/" className="px-6 py-3 rounded-full bg-[#00373E] text-white font-semibold">Go Home</Link>
          <Link to="/services" className="px-6 py-3 rounded-full bg-white border border-gray-300 text-[#00373E] font-semibold">View Services</Link>
        </div>
      </div>
    </div>
  );
}
