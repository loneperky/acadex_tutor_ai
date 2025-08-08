import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Star, 
  Play, 
  CheckCircle, 
  Trophy,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Quizzes() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const quizzes = [
    {
      id: 1,
      title: "Calculus Fundamentals",
      subject: "Mathematics",
      difficulty: "Beginner",
      duration: "15 min",
      questions: 20,
      score: 85,
      completed: true,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Quantum Mechanics Basics",
      subject: "Physics",
      difficulty: "Advanced",
      duration: "30 min",
      questions: 25,
      score: null,
      completed: false,
      rating: 4.9,
    },
    {
      id: 3,
      title: "Organic Chemistry Reactions",
      subject: "Chemistry",
      difficulty: "Intermediate",
      duration: "20 min",
      questions: 18,
      score: 92,
      completed: true,
      rating: 4.7,
    },
    {
      id: 4,
      title: "Cell Biology",
      subject: "Biology",
      difficulty: "Beginner",
      duration: "12 min",
      questions: 15,
      score: null,
      completed: false,
      rating: 4.6,
    },
    {
      id: 5,
      title: "Linear Algebra",
      subject: "Mathematics",
      difficulty: "Intermediate",
      duration: "25 min",
      questions: 22,
      score: 78,
      completed: true,
      rating: 4.5,
    },
    {
      id: 6,
      title: "Thermodynamics",
      subject: "Physics",
      difficulty: "Advanced",
      duration: "35 min",
      questions: 30,
      score: null,
      completed: false,
      rating: 4.8,
    },
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology"];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesDifficulty = !selectedDifficulty || quiz.difficulty === selectedDifficulty;
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Intermediate": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Advanced": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
            <p className="text-muted-foreground">
              Test your knowledge across different subjects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Best Score: 92%</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedDifficulty === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(null)}
            >
              All
            </Button>
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Quizzes</span>
            </div>
            <p className="text-2xl font-bold mt-1">{quizzes.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold mt-1">{quizzes.filter(q => q.completed).length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Average Score</span>
            </div>
            <p className="text-2xl font-bold mt-1">85%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Best Subject</span>
            </div>
            <p className="text-2xl font-bold mt-1">Chemistry</p>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg leading-tight">{quiz.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {quiz.subject}
                  </Badge>
                </div>
                {quiz.completed && (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{quiz.duration}</span>
                </div>
                <span className="text-muted-foreground">{quiz.questions} questions</span>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-muted-foreground">{quiz.rating}</span>
                </div>
              </div>

              {quiz.completed && quiz.score && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Your Score</span>
                    <span className={`font-medium ${getScoreColor(quiz.score)}`}>
                      {quiz.score}%
                    </span>
                  </div>
                  <Progress value={quiz.score} className="h-2" />
                </div>
              )}

              <Button 
                className="w-full" 
                variant={quiz.completed ? "outline" : "default"}
              >
                <Play className="h-4 w-4 mr-2" />
                {quiz.completed ? "Retake Quiz" : "Start Quiz"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No quizzes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}