
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
        background: "#fff",
        border: "1px solid #e0e3e7",
        borderRadius: "5px",
        padding: "7px 14px",
        marginBottom: "2px",
        minHeight: "36px"
      }}
      aria-label="Breadcrumb"
    >
      <ol style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        margin: 0,
        padding: 0,
        listStyle: "none",
      }}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} style={{ display: "inline-flex", alignItems: "center" }}>
            {index > 0 && (
              <ChevronRight
                style={{
                  width: "13px",
                  height: "13px",
                  color: "#b6beca",
                  margin: "0 4px"
                }}
              />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1e293b"
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
