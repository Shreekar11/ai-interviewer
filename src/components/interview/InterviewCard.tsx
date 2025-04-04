import React from "react";

interface InterviewCardProps {
  title: string;
  date: string;
  type: "personal" | "custom";
  tags?: string[];
}

const InterviewCard: React.FC<InterviewCardProps> = ({ title, date, type, tags }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg p-5">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{date}</p>

      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            type === "personal" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"
          }`}
        >
          {type} interview
        </span>

        <button className="text-sm text-blue-500 hover:text-blue-700 font-medium transition">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;
