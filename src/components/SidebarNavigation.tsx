
"use client"

import type React from "react"
import { Folder, FolderOpen, Home } from "lucide-react"
import { useSSRSBrowser } from "../hooks/useSSRS"
import { ConnectionStatus } from "./ConnectionStatus"

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
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ padding: "20px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#0f172a",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            letterSpacing: "-0.01em",
          }}
        >
          <FolderOpen style={{ marginRight: "8px", height: "18px", width: "18px", color: "#64748b" }} />
          Report Folders
        </h3>

        <div style={{ marginBottom: "16px" }}>
          <ConnectionStatus />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {folderItems.map((item) => {
            const Icon = item.icon
            const isSelected = selectedPath === item.path

            return (
              <div
                key={item.path}
                style={{
                  cursor: "pointer",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  backgroundColor: isSelected ? "#f1f5f9" : "transparent",
                  border: isSelected ? "1px solid #cbd5e1" : "1px solid transparent",
                  color: isSelected ? "#0f172a" : "#475569",
                  fontWeight: isSelected ? "500" : "400",
                }}
                onClick={() => onPathChange(item.path)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#f8fafc"
                    e.currentTarget.style.color = "#334155"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color = "#475569"
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Icon
                    style={{
                      marginRight: "10px",
                      height: "16px",
                      width: "16px",
                      color: item.path === "/" ? "#64748b" : "#94a3b8",
                    }}
                  />
                  <span style={{ fontSize: "14px" }}>{item.name}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
