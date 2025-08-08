// components/ResourceCard.tsx
import { Link } from "react-router-dom";

interface ResourceCardProps {
  title: string;
  thumbnail: string;
  channel: string;
  videoId: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ title, thumbnail, channel, videoId }) => {
  return (
    <Link to={`/watch/${videoId}`}>
      <div className="border rounded-md p-4 shadow hover:shadow-lg transition">
        <img src={thumbnail} alt={title} className="w-full h-48 object-cover rounded" />
        <h2 className="mt-2 text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{channel}</p>
      </div>
    </Link>
  );
};
