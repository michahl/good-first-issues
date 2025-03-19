import { Clock, Save, Check } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { type Issue } from "@/app/actions";
import { Bookmark, BookmarkChecked, Calendar, Star, Tag } from "./icons";

interface IssueCardProps {
    issue: Issue;  
    isSaved: boolean;   
    onToggleSave: () => void;
}

export default function IssueCard({ issue, isSaved, onToggleSave }: IssueCardProps) {
    // Format the last activity date
    const lastActivity = new Date(issue.updated_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  
    // Check if we have repository data
    const hasRepoData = !!issue.repository
  
    return (
      <div className="px-10 py-4 border-2 rounded-lg bg-card/20 hover:bg-card/50 transition-colors mb-3 group">
        <div className="flex justify-between items-start">
          <div className="">
            <div className="flex flex-col items-start">
                <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-blue-500 hover:text-blue-600 hover:underline underline-offset-3 transition-colors"
                >
                    {issue.title}
                </a>
                <a 
                    href={issue.repository?.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    {issue.repository?.full_name || "Repository not available"}
                </a>
            </div>
            <div className="mt-4 flex flex-wrap items-center space-x-4 text-sm text-muted-foreground">
              {hasRepoData && (
                <>
                    <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{issue.repository?.stargazers_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>{issue.repository?.language || "Unknown"}</span>
                    </div>
                </>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{lastActivity}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <p>{issue.labels.map((label) => label.name).join(", ")}</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSave}
            className={`${isSaved ? "text-primary" : "text-muted-foreground"} hover:bg-transparent`}
            disabled={!hasRepoData}
            title={hasRepoData ? (isSaved ? "Unsave Issue" : "Save Issue") : "Repository data not available"}
          >
            {isSaved ? <BookmarkChecked className="h-6 w-6" /> : <Bookmark className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    )
  }