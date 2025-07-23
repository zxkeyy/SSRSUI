
"use client"

import type React from "react"
import { Home, ChevronRight } from "lucide-react"

interface BreadcrumbNavigationProps {
  currentPath: string
  onPathChange: (path: string) => void
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({ currentPath, onPathChange }) => {
  const pathParts = currentPath.split("/").filter(Boolean)

  const breadcrumbs = [
    { name: "Root", path: "/" },
    ...pathParts.map((part, index) => ({
      name: part,
      path: "/" + pathParts.slice(0, index + 1).join("/"),
    })),
  ]

  return (
    <nav 
      style={{ 
        display: "flex", 
        marginBottom: "8px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        padding: "12px 16px",
      }} 
      aria-label="Breadcrumb"
    >
      <ol style={{ 
        display: "inline-flex", 
        alignItems: "center", 
        gap: "6px",
        margin: 0,
        padding: 0,
        listStyle: "none",
      }}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} style={{ display: "inline-flex", alignItems: "center" }}>
            {index > 0 && (
              <ChevronRight 
                style={{ 
                  width: "14px", 
                  height: "14px", 
                  color: "#94a3b8", 
                  margin: "0 6px" 
                }} 
              />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span style={{ 
                fontSize: "14px", 
                fontWeight: "500", 
                color: "#0f172a"
              }}>
                {breadcrumb.name}
              </span>
            ) : (
              <button
                onClick={() => onPathChange(breadcrumb.path)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#64748b",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 8px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#0f172a"
                  e.currentTarget.style.backgroundColor = "#f8fafc"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#64748b"
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                {index === 0 && <Home style={{ marginRight: "6px", height: "14px", width: "14px" }} />}
                {breadcrumb.name}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
