import { Mic, ListChecks, FileText, Lightbulb } from "lucide-react";

const features = [
  {
    title: "Voice Explanation",
    description: "Listen to AI-generated voice answers for deeper understanding of topics.",
    icon: <Mic className="w-5 h-5 text-primary" />,
  },
  {
    title: "Quiz Generator",
    description: "Automatically generate quizzes based on your study questions.",
    icon: <ListChecks className="w-5 h-5 text-primary" />,
  },
  {
    title: "Smart Summary",
    description: "Get quick, focused summaries for long answers or study materials.",
    icon: <FileText className="w-5 h-5 text-primary" />,
  },
];

export default function BetaPage() {
  return (
    <div className="max-w-2xl mx-auto py-6 px-2">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Lightbulb className="text-yellow-400 w-6 h-6" />
        Beta Features
      </h1>
      <div className="space-y-4">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-muted/40 hover:bg-muted transition-shadow hover:shadow-md"
          >
            <div className="mt-1">{feature.icon}</div>
            <div>
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
