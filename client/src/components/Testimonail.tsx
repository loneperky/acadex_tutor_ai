// components/TestimonialCard.tsx

interface TestimonialCardProps {
  sub: string;
  img: string;
  name: string;
  star: string;
}

export default function TestimonialCard({ sub, img, name, star }: TestimonialCardProps) {
  return (
    <div className="border border-green-500 shadow-md p-6 rounded-xl max-w-md text-center">
      <p className="text-gray-300 mb-4 italic">"{sub}"</p>
      <div className="flex flex-col items-center gap-2">
        <img
          src={img}
          alt={name}
          className="w-16 h-16 rounded-full object-cover mb-2"
        />
        <h4 className="font-semibold text-lg">{name}</h4>
        <span className="text-yellow-500">{star}</span>
      </div>
    </div>
  );
}

