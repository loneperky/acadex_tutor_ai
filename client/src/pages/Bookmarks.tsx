import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookmarkUnion } from "@/hooks/useBookmarks";
import { useBookmarks } from "@/hooks/useBookmarks";
import {
  Bookmark,
  Search,
  Calendar,
  ExternalLink,
  Trash2,
  Filter,
  Book,
  FileText,
  Video,
  Link
} from "lucide-react";

import { BookmarkType } from "@/hooks/useBookmarks";

export default function Bookmarks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const navigate = useNavigate()


  const { bookmarks, loading, error, removeBookmark, fetchBookmarks } =
    useBookmarks(selectedType ? (selectedType.toLowerCase() as BookmarkType) : undefined);



  useEffect(() => {
    fetchBookmarks();
  }, [selectedType]);

  useEffect(() => {
    fetchBookmarks()
  }, [])


  const getBookmarkData = (bookmark: BookmarkUnion) => {

    const type = bookmark.type;
    let title = "";
    let subject = "";
    let content = "";
    let date = "";
    let url = "";

    switch (type) {
      case "chat":
        title = bookmark.item.title || "Untitled Chat";
        subject = bookmark?.item.subject_emphasis || "";
        content = "";
        date = bookmark.item.created_at || bookmark.created_at;
        url = `/chat/${bookmark.item_id}`;
        break;

      case "video":
        title = bookmark.item?.title || "Untitled Video";
        content = "";
        date = bookmark.item?.created_at || bookmark.created_at;
        url = bookmark.item?.url || `https://www.youtube.com/watch?v=${bookmark.item_id}`;
        break;

      case "resource":
        title = bookmark.item?.title || "Untitled Resource";
        content = bookmark.item?.description || "";
        date = bookmark.item?.created_at || bookmark.created_at;
        url = bookmark.item?.link || "";
        break;

      case "question":
        title = bookmark.item?.content || "Untitled Question";
        content = bookmark.item?.answer || "";
        date = bookmark.item?.created_at || bookmark.created_at;
        url = bookmark.item?.content || `https://www.youtube.com/watch?v=${bookmark.item_id}`;
        break;
    }

    return { title, subject, content, date, url };
  };


  const types = ["chat", "question", "video", "resource"];


  const filteredBookmarks = bookmarks.filter(bookmark => {
    const { title, subject, content } = getBookmarkData(bookmark);

    const matchesType = !selectedType || bookmark.type.toLowerCase() === selectedType.toLowerCase();
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });


  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "question": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "video": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "resource": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "chat": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };


  const handleRemoveBookmark = async (type: BookmarkType, itemId: string) => {
    try {
      await removeBookmark(type, itemId);
      toast.success("Bookmarked removed")
    } catch (err) {
      console.error("Failed to remove bookmark", err);
    }
  };

  const handleOpenBookmark = (url: string) => {
    if (!url) {
      toast.error("No URL found for this bookmark");
      return;
    }
    if (url.startsWith("http")) {
      window.open(url, "_blank");
    } else {
      navigate(url);
    }
  };



  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bookmarks</h1>
            <p className="text-muted-foreground">
              Your saved questions, resources, and study materials
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{bookmarks.length} saved</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(null)}
            >
              All Types
            </Button>
            {types.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {types.map((type) => {
          const count = bookmarks.filter(b => b.type.toLowerCase() === type.toLowerCase()).length;

          return (
            <Card key={type}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-sm text-muted-foreground">{type}s</p>
              </CardContent>
            </Card>
          );
        })}
      </div>



      {/* Bookmarks List */}
      <div className="space-y-4">
        {filteredBookmarks.map((bookmark) => {
          const { title, subject, content, date, url } = getBookmarkData(bookmark);

          const getIcon = (type: string) => {
            switch (type) {
              case "question":
                return FileText;
              case "video":
                return Video;
              case "resource":
                return Book;
              case "chat":
                return FileText;
              default:
                return Bookmark;
            }
          };

          const Icon = getIcon(bookmark.type);

          return (
            <Card key={bookmark.id} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                            {title}
                          </h3>
                          <Badge className={getTypeColor(bookmark.type)}>
                            {bookmark.type}
                          </Badge>
                          {subject && (
                            <Badge variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {content}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0 w-full sm:w-auto">
                        <Button
                          size="sm"
                          className="whitespace-nowrap w-full sm:w-auto" 
                          variant="outline"
                          onClick={() => handleOpenBookmark(url)}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveBookmark(bookmark.type, bookmark.item_id)}
                           className="whitespace-nowrap w-full sm:w-auto text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}


      </div>

      {filteredBookmarks.length === 0 && (
        <div className="text-center py-12">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No bookmarks found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedType
              ? "Try adjusting your search or filter criteria."
              : "Start bookmarking your favorite questions and resources to see them here."
            }
          </p>
        </div>
      )}
    </div>
  );
}