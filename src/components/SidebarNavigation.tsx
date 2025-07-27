
"use client"

import type React from "react"
import { Folder, FolderOpen, Home } from "lucide-react"
import { useSSRSBrowser } from "../hooks/useSSRS"

interface SidebarNavigationProps {
  selectedPath: string
  onPathChange: (path: string) => void
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ selectedPath, onPathChange }) => {
  const { folderData } = useSSRSBrowser("/")

  const folderItems = [
    { name: "Root", path: "/", icon: Home },
    ...(folderData?.folders || []).map((folder) => ({
      name: folder.name,
      path: folder.path,
      icon: Folder,
    })),
  ]

  return (
    <div
      className="professional-card"
      style={{
        overflow: "hidden",
        border: "none",
        boxShadow: "none",
        background: "transparent",
        padding: 0,
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ padding: "14px 8px 8px 8px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            letterSpacing: "-0.01em",
          }}
        >
          <FolderOpen style={{ marginRight: "7px", height: "17px", width: "17px", color: "#64748b" }} />
          Report Folders
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          {folderItems.map((item) => {
            const Icon = item.icon
            const isSelected = selectedPath === item.path

            return (
              <div
                key={item.path}
                style={{
                  cursor: "pointer",
                  padding: "7px 10px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  backgroundColor: isSelected ? "#e8f0fe" : "transparent",
                  border: isSelected ? "1.5px solid #2563eb" : "1px solid transparent",
                  color: isSelected ? "#2563eb" : "#334155",
                  fontWeight: isSelected ? 600 : 400,
                  marginBottom: "1px",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center"
                }}
                onClick={() => onPathChange(item.path)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#f3f6fa"
                    e.currentTarget.style.color = "#334155"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color = "#334155"
                  }
                }}
              >
                <Icon
                  style={{
                    marginRight: "8px",
                    height: "15px",
                    width: "15px",
                    color: item.path === "/" ? "#64748b" : "#94a3b8",
                  }}
                />
                <span>{item.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
