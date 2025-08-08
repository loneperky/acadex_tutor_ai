import React from "react";

interface PriceProps {
  type: string;
  amount: number;
  included: string[];
}

const Price = ({ type, amount, included }: PriceProps) => {
  return (
    <div className="bg-white text-black rounded-2xl p-8 shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold capitalize mb-2">{type}</h2>
        <p className="text-4xl font-bold mb-4 text-green-600">${amount}</p>
        <p className="text-lg font-semibold mb-3">What's Included:</p>
        <ul className="space-y-2 text-gray-700">
          {included.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              ✅ <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-6">
        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Price;
