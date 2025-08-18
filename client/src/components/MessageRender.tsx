import React from "react";

export default function MessageRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  let listCounter = 1;

  return (
    <div className="space-y-3 leading-relaxed">
      {lines.map((line, i) => {
        // === H1 Gradient Heading ===
        if (line.endsWith("**")) {
          return (
            <h1
              key={i}
              className="text-2xl font-bold"
            >
              {line.replace("**", "").trim()}
            </h1>
          );
        }

        // === H2 Sub-heading (Green) ===
        if (line.startsWith("* ")) {
          return (
            <h2 key={i} className="text-base font-semibold text-neutral-100">
              {line.replace("* ", "").trim()}
            </h2>
          );
        }
        if (line.includes("+")) {
          return (
            <h2 key={i} className="text-base font-semibold text-neutral-100">
              {line.replace("** ", "").trim()}
            </h2>
          );
        }

        // === H3 Smaller Heading (Purple) ===
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-semibold text-purple-400">
              {line.replace("### ", "").trim()}
            </h3>
          );
        }

        // === Ordered List (+) ===
        if (line.startsWith("+")) {
          return (
            <div key={i} className="ml-4 flex gap-2 text-black">
              <span className=" font-bold">{listCounter++}.</span>
              <span>{line.replace("+", "").trim()}</span>
            </div>
          );
        } else {
          // Reset counter if we encounter non-list
          listCounter = 1;
        }

        // === Code Block ===
        if (line.startsWith("+```") && line.endsWith("```")) {
          return (
            <pre
              key={i}
              className="bg-gray-800 text-gray-100 p-3 rounded-md text-sm overflow-x-auto"
            >
              <code>{line.replace("```", " ").trim()}</code>
            </pre>
          );
        }

        // === Normal Paragraph ===
        if (line.trim() !== "") {
          return (
            <div className="flex">
              <p key={i} className="text-gray-200">
                {line.trim()}
              </p>
              <hr className="border-gray-900" />
            </div>


          );
        }
        return null;
      })}
    </div>
  );
}
