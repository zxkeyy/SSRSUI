"use client"

import React from "react"
import { useSSRSBrowser } from "../hooks/useSSRS"
import type { FolderItem, ReportItem } from "../types/api"

interface FolderBrowserProps {
  onReportSelect: (reportPath: string) => void
  selectedReport: string | null
}

export const FolderBrowser: React.FC<FolderBrowserProps> = ({ onReportSelect, selectedReport }) => {
  const { currentPath, folderData, isLoading, error, navigateToFolder, navigateUp } = useSSRSBrowser()

  const handleFolderClick = (folder: FolderItem) => {
    navigateToFolder(folder.path)
  }

  const handleReportClick = (report: ReportItem) => {
    onReportSelect(report.path)
  }

  const pathParts = currentPath.split("/").filter(Boolean)

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>Reports Browser</h3>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6b7280" }}>
          <button
            onClick={() => navigateToFolder("/")}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
              padding: "2px 4px",
              borderRadius: "2px",
            }}
          >
            Root
          </button>
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              <span>/</span>
              <button
                onClick={() => navigateToFolder("/" + pathParts.slice(0, index + 1).join("/"))}
                style={{
                  background: "none",
                  border: "none",
                  color: index === pathParts.length - 1 ? "#374151" : "#3b82f6",
                  cursor: index === pathParts.length - 1 ? "default" : "pointer",
                  padding: "2px 4px",
                  borderRadius: "2px",
                  fontWeight: index === pathParts.length - 1 ? "500" : "normal",
                }}
              >
                {part}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
        {isLoading && <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>Loading...</div>}

        {error && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              borderRadius: "4px",
              margin: "8px",
            }}
          >
            Error: {error}
          </div>
        )}

        {folderData && !isLoading && (
          <div>
            {/* Up button */}
            {currentPath !== "/" && (
              <button
                onClick={navigateUp}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  margin: "4px 0",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📁</span>
                <span>.. (Up)</span>
              </button>
            )}

            {/* Folders */}
            {folderData.folders.map((folder) => (
              <button
                key={folder.path}
                onClick={() => handleFolderClick(folder)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  margin: "2px 0",
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb"
                  e.currentTarget.style.borderColor = "#d1d5db"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white"
                  e.currentTarget.style.borderColor = "#e5e7eb"
                }}
              >
                <span>📁</span>
                <div>
                  <div style={{ fontWeight: "500", color: "#374151" }}>{folder.name}</div>
                  {folder.description && <div style={{ fontSize: "12px", color: "#6b7280" }}>{folder.description}</div>}
                </div>
              </button>
            ))}

            {/* Reports */}
            {folderData.reports.map((report) => (
              <button
                key={report.path}
                onClick={() => handleReportClick(report)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  margin: "2px 0",
                  backgroundColor: selectedReport === report.path ? "#eff6ff" : "white",
                  border: selectedReport === report.path ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (selectedReport !== report.path) {
                    e.currentTarget.style.backgroundColor = "#f9fafb"
                    e.currentTarget.style.borderColor = "#d1d5db"
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedReport !== report.path) {
                    e.currentTarget.style.backgroundColor = "white"
                    e.currentTarget.style.borderColor = "#e5e7eb"
                  }
                }}
              >
                <span>📊</span>
                <div>
                  <div
                    style={{
                      fontWeight: "500",
                      color: selectedReport === report.path ? "#1d4ed8" : "#374151",
                    }}
                  >
                    {report.name}
                  </div>
                  {report.description && <div style={{ fontSize: "12px", color: "#6b7280" }}>{report.description}</div>}
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                    Modified: {new Date(report.modifiedDate).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
