import React from "react";
import { Badge } from "../ui/badge";

interface InterviewCardProps {
  title: string;
  date: string;
  type: string;
  tags?: string[];
}

function parseDate(isoDateString: string) {
  // Create a Date object from the ISO string
  const date = new Date(isoDateString);
  // Return formatted date string
  return date.toLocaleString("en-US");
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  title,
  date,
  type,
  tags,
}) => {
  const typeName = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg p-5">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{parseDate(date)}</p>

      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            type === "PERSONAL"
              ? "bg-green-100 text-green-600"
              : "bg-purple-100 text-purple-600"
          }`}
        >
          {typeName} interview
        </span>

        <button className="text-sm text-blue-500 hover:text-blue-700 font-medium transition">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;
