import React from "react";

export default function MessageRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  let listCounter = 1;

  return (
    <div className="space-y-3 leading-relaxed">
      {lines.map((line, i) => {
        // === H1 Gradient Heading (text ending with **) ===
        if (/^\*{2}(.*)\*{2}$/.test(line)) {
          return (
            <h1 key={i} className="text-2xl font-bold text-green-200">
              {line.replace(/^\*{2}|\*{2}$/g, "").trim()}
            </h1>
          );
        }


        // === H2 Sub-heading (starts with * ) ===
        if (/^\* (.*)/.test(line)) {
          return (
            <h2 key={i} className="text-base font-semibold text-neutral-100">
              {line.replace(/^\* /, "").trim()}
            </h2>
          );
        }

        // === Normal Paragraph ===
        if (line.trim() !== "") {
          return (
            <div key={i} className="flex">
              <p className="text-gray-100">
                {line.replace(/\*+/g, "").trim()}
              </p>
              <hr className="border-gray-500" />
            </div>
          );
        }


        return null;
      })}
    </div>
  );
}
