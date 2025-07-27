"use client"

import { useState } from "react"
import type { SearchResult } from "../types/api" // Import the SearchResult type

// SearchPanel Component
export const SearchPanel = ({ onReportSelect }: { onReportSelect: (path: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Import the API service
      const { ssrsApi } = await import("../services/ssrsApi")
      const results: SearchResult[] = await ssrsApi.searchReports(searchQuery)
      setSearchResults(results)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="professional-card" style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "16px" }}>
        Search Reports
      </h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reports and folders..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "14px"
          }}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            background: isLoading || !searchQuery.trim() ? "#94a3b8" : "#2563eb",
            color: "white",
            fontSize: "14px",
            fontWeight: "500",
            cursor: isLoading || !searchQuery.trim() ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div style={{
          padding: "12px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "6px",
          color: "#dc2626",
          fontSize: "14px",
          marginBottom: "20px"
        }}>
          Error: {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
            Search Results ({searchResults.length})
          </h3>
          <div style={{ display: "grid", gap: "12px" }}>
            {searchResults.map((result: SearchResult) => (
              <div
                key={result.path}
                onClick={() => result.type === "Report" && onReportSelect(result.path)}
                style={{
                  padding: "16px",
                  border: "1px solid #e0e3e7",
                  borderRadius: "6px",
                  backgroundColor: "#fff",
                  cursor: result.type === "Report" ? "pointer" : "default",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (result.type === "Report") {
                    e.currentTarget.style.backgroundColor = "#f0f9ff"
                    e.currentTarget.style.borderColor = "#0ea5e9"
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff"
                  e.currentTarget.style.borderColor = "#e0e3e7"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ marginRight: "8px", fontSize: "16px" }}>
                    {result.type === "Report" ? "📊" : "📁"}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>
                    {result.name}
                  </span>
                  <span style={{
                    marginLeft: "8px",
                    padding: "2px 8px",
                    fontSize: "12px",
                    backgroundColor: result.type === "Report" ? "#dbeafe" : "#f3f4f6",
                    color: result.type === "Report" ? "#1e40af" : "#374151",
                    borderRadius: "12px"
                  }}>
                    {result.type}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
                  Path: {result.path}
                </div>
                {result.description && (
                  <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
                    {result.description}
                  </div>
                )}
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                  Modified: {new Date(result.modifiedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}