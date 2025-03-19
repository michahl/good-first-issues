"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchIssues, type Issue, type Repository } from "./actions"
import IssueCard from "@/components/issue-card"
import { Star } from "@/components/icons"

interface SavedIssue extends Issue {
  repository: Repository
}

export default function Home() {
  const [savedIssues, setSavedIssues] = useState<SavedIssue[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [minStars, setMinStars] = useState(0)
  const [maxStars, setMaxStars] = useState(250000)
  const [tempMinStars, setTempMinStars] = useState(0)
  const [tempMaxStars, setTempMaxStars] = useState(250000)
  const [language, setLanguage] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  // Load saved issues from localStorage
  useEffect(() => {
    const savedIssuesFromStorage = localStorage.getItem("savedIssues")
    if (savedIssuesFromStorage) {
      setSavedIssues(JSON.parse(savedIssuesFromStorage))
    }
  }, [])

  // Fetch issues from GitHub
  const loadIssues = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { issues: fetchedIssues, totalCount: count } = await fetchIssues(
        language || undefined,
        minStars > 0 ? minStars : undefined,
        maxStars < 250000 ? maxStars : undefined,
        page,
      )

      setIssues(fetchedIssues)
      setTotalCount(count)
    } catch (err) {
      console.error("Error loading issues:", err)
      setError("Failed to load issues. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [language, minStars, maxStars, page])

  // Load issues when filters change
  useEffect(() => {
    loadIssues()
  }, [loadIssues])

  // Toggle save/unsave issue
  const toggleSaveIssue = (issue: Issue) => {
    if (!issue.repository) return

    const savedIssue = issue as SavedIssue
    const isAlreadySaved = savedIssues.some((saved) => saved.id === issue.id)

    let updatedSavedIssues
    if (isAlreadySaved) {
      updatedSavedIssues = savedIssues.filter((saved) => saved.id !== issue.id)
    } else {
      updatedSavedIssues = [...savedIssues, savedIssue]
    }

    setSavedIssues(updatedSavedIssues)
    localStorage.setItem("savedIssues", JSON.stringify(updatedSavedIssues))
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempMinStars(minStars)
      setTempMaxStars(maxStars)
    }
    setShowFilters(open)
  }

  const applyStarFilters = () => {
    setMinStars(tempMinStars)
    setMaxStars(tempMaxStars)
    setPage(1) // Reset to first page when filters change
    setShowFilters(false)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(e.target.value)
    setPage(1) // Reset to first page when language changes
  }

  const clearFilters = () => {
    setMinStars(0)
    setMaxStars(250000)
    setLanguage("")
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/30 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-medium text-center">
            good <span className="font-serif italic">first</span> issue
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-5 md:px-3 py-0 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x md:divide-border/30 gap-8">
          {/* Sidebar */}
          <div className="space-y-8 p-8 md:p-8">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">About</h2>
              <p className="text-sm text-muted-foreground">
                Find good first issues in open source projects to help you get started contributing to the community.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Browse by Language
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filter by language..."
                  value={language}
                  onChange={handleLanguageChange}
                  className="pl-9 bg-card/50 border-border/30"
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Filter by Stars
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
                className="w-full justify-between border-border/30"
              >
                <span>
                  {minStars.toLocaleString()} - {maxStars.toLocaleString()}
                </span>
                <Star className="h-3.5 w-3.5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3 md:pl-8 mt-8">
            <Tabs value={activeTab} className="w-full space-y-6" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="all" className="border-none cursor-pointer">All Issues</TabsTrigger>
                  <TabsTrigger value="saved" className="border-none cursor-pointer">Saved</TabsTrigger>
                </TabsList>
                {(minStars > 0 || maxStars < 250000 || language) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              <TabsContent value="all">
                <div className="mb-4">
                  <h2 className="text-xl font-medium text-muted-foreground">
                    {loading ? "Loading issues..." : `${totalCount.toLocaleString()} Issues Found`}
                  </h2>
                </div>

                {loading ? (
                  <div className="py-20 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="py-8 text-center">
                    <p className="text-destructive">{error}</p>
                    <Button variant="outline" className="mt-4" onClick={loadIssues}>
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-border/30">
                      {issues.length === 0 ? (
                        <div className="py-8 text-center">
                          <p>No issues match your filters. Try adjusting your criteria.</p>
                        </div>
                      ) : (
                        issues.map((issue) => (
                          <IssueCard
                            key={issue.id}
                            issue={issue}
                            isSaved={savedIssues.some((saved) => saved.id === issue.id)}
                            onToggleSave={() => toggleSaveIssue(issue)}
                          />
                        ))
                      )}
                    </div>

                    {/* Pagination */}
                    {issues.length > 0 && (
                      <div className="flex justify-between items-center mt-8">
                        <Button
                          variant="outline"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1 || loading}
                          className="cursor-pointer"
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">Page {page}</span>
                        <Button
                          variant="outline"
                          onClick={() => setPage((p) => p + 1)}
                          disabled={issues.length < 5 || loading}
                          className="cursor-pointer"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="saved">
                <div className="mb-4">
                  <h2 className="text-xl font-medium text-muted-foreground">{savedIssues.length} Saved Issues</h2>
                </div>
                <div className="divide-y divide-border/30">
                  {savedIssues.length === 0 ? (
                    <div className="py-8 text-center">
                      <p>You haven&rsquo;t saved any issues yet.</p>
                      <Button variant="outline" className="mt-4 cursor-pointer" onClick={() => setActiveTab("all")}>
                        Browse Issues
                      </Button>
                    </div>
                  ) : (
                    savedIssues.map((issue) => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        isSaved={true}
                        onToggleSave={() => toggleSaveIssue(issue)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Dialog open={showFilters} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter by Repository Stars</DialogTitle>
            <DialogDescription>
              Adjust the range to filter issues from repositories with a specific number of stars.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Stars Range</Label>
              <Slider
                min={0}
                max={250000}
                step={1000}
                value={[tempMinStars, tempMaxStars]}
                onValueChange={(values) => {
                  // Ensure we're updating both values correctly
                  if (values.length === 2) {
                    setTempMinStars(values[0])
                    setTempMaxStars(values[1])
                  }
                }}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{tempMinStars.toLocaleString()}</span>
                <span>{tempMaxStars.toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="min-stars" className="text-sm">
                  Min Stars
                </Label>
                <Input
                  id="min-stars"
                  type="number"
                  min={0}
                  max={tempMaxStars}
                  value={tempMinStars}
                  onChange={(e) => setTempMinStars(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="max-stars" className="text-sm">
                  Max Stars
                </Label>
                <Input
                  id="max-stars"
                  type="number"
                  min={tempMinStars}
                  max={250000}
                  value={tempMaxStars}
                  onChange={(e) => setTempMaxStars(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFilters(false)}>
              Cancel
            </Button>
            <Button onClick={applyStarFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

