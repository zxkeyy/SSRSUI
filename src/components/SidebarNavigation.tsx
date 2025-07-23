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
  const { folderData } = useSSRSBrowser()

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
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      <div style={{ padding: "24px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "500",
            color: "#111827",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FolderOpen style={{ marginRight: "8px", height: "20px", width: "20px" }} />
          Report Folders
        </h3>

        <ConnectionStatus />

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {folderItems.map((item) => {
            const Icon = item.icon
            const isSelected = selectedPath === item.path

            return (
              <div
                key={item.path}
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "6px",
                  transition: "all 0.2s",
                  backgroundColor: isSelected ? "#dbeafe" : "transparent",
                  color: isSelected ? "#2563eb" : "#374151",
                  fontWeight: isSelected ? "500" : "normal",
                }}
                onClick={() => onPathChange(item.path)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#f9fafb"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Icon
                    style={{
                      marginRight: "8px",
                      height: "16px",
                      width: "16px",
                      color: item.path === "/" ? "#2563eb" : "#eab308",
                    }}
                  />
                  {item.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}