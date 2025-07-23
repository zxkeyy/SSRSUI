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
    <nav style={{ display: "flex", marginBottom: "24px" }} aria-label="Breadcrumb">
      <ol style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} style={{ display: "inline-flex", alignItems: "center" }}>
            {index > 0 && <ChevronRight style={{ width: "16px", height: "16px", color: "#9ca3af", margin: "0 8px" }} />}
            {index === breadcrumbs.length - 1 ? (
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>{breadcrumb.name}</span>
            ) : (
              <button
                onClick={() => onPathChange(breadcrumb.path)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#2563eb"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#374151"
                }}
              >
                {index === 0 && <Home style={{ marginRight: "8px", height: "16px", width: "16px" }} />}
                {breadcrumb.name}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
