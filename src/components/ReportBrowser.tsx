"use client"

import type React from "react"
import { Folder, FileText, RefreshCw, Play, Info } from "lucide-react"
import { useSSRSBrowser } from "../hooks/useSSRS"
import { formatDate } from "../lib/utils"

interface ReportBrowserProps {
  currentPath: string
  onPathChange: (path: string) => void
  onReportSelect: (reportPath: string) => void
}

export const ReportBrowser: React.FC<ReportBrowserProps> = ({  onPathChange, onReportSelect }) => {
  const { folderData, isLoading, refreshFolder } = useSSRSBrowser()

  const handleRefresh = () => {
    refreshFolder()
  }

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        }}
      >
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div style={{ height: "24px", width: "160px", backgroundColor: "#f3f4f6", borderRadius: "4px" }} />
            <div style={{ height: "40px", width: "96px", backgroundColor: "#f3f4f6", borderRadius: "4px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ height: "16px", width: "16px", backgroundColor: "#f3f4f6", borderRadius: "4px" }} />
                <div style={{ height: "16px", width: "192px", backgroundColor: "#f3f4f6", borderRadius: "4px" }} />
                <div style={{ height: "16px", width: "64px", backgroundColor: "#f3f4f6", borderRadius: "4px" }} />
                <div style={{ height: "16px", width: "96px", backgroundColor: "#f3f4f6", borderRadius: "4px" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const allItems = [
    ...(folderData?.folders || []).map((folder) => ({ ...folder, type: "folder" as const })),
    ...(folderData?.reports || []).map((report) => ({ ...report, type: "report" as const })),
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "500", color: "#111827", margin: 0 }}>Reports & Folders</h2>
          <button
            onClick={handleRefresh}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f9fafb"
              e.currentTarget.style.borderColor = "#9ca3af"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white"
              e.currentTarget.style.borderColor = "#d1d5db"
            }}
          >
            <RefreshCw style={{ marginRight: "8px", height: "16px", width: "16px" }} />
            Refresh
          </button>
        </div>

        <div style={{ overflow: "hidden" }}>
          {allItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <Folder style={{ margin: "0 auto", height: "48px", width: "48px", color: "#9ca3af" }} />
              <h3 style={{ marginTop: "8px", fontSize: "14px", fontWeight: "500", color: "#111827" }}>
                No items found
              </h3>
              <p style={{ marginTop: "4px", fontSize: "14px", color: "#6b7280" }}>This folder appears to be empty.</p>
            </div>
          ) : (
            <table style={{ minWidth: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Modified
                  </th>
                  <th
                    style={{
                      padding: "12px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "white" }}>
                {allItems.map((item, index) => (
                  <tr
                    key={item.path}
                    style={{
                      cursor: "pointer",
                      borderBottom: index < allItems.length - 1 ? "1px solid #e5e7eb" : "none",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "white"
                    }}
                    onDoubleClick={() => {
                      if (item.type === "folder") {
                        onPathChange(item.path)
                      } else {
                        onReportSelect(item.path)
                      }
                    }}
                  >
                    <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {item.type === "folder" ? (
                          <Folder style={{ height: "20px", width: "20px", color: "#eab308", marginRight: "12px" }} />
                        ) : (
                          <FileText style={{ height: "20px", width: "20px", color: "#2563eb", marginRight: "12px" }} />
                        )}
                        <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "2px 8px",
                          fontSize: "12px",
                          fontWeight: "500",
                          borderRadius: "9999px",
                          backgroundColor: item.type === "folder" ? "#f3f4f6" : "#dbeafe",
                          color: item.type === "folder" ? "#374151" : "#1e40af",
                        }}
                      >
                        {item.type === "folder" ? "Folder" : "Report"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", whiteSpace: "nowrap", fontSize: "14px", color: "#6b7280" }}>
                      {formatDate(item.modifiedDate)}
                    </td>
                    <td style={{ padding: "16px 24px", whiteSpace: "nowrap", fontSize: "14px", color: "#6b7280" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {item.type === "folder" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onPathChange(item.path)
                            }}
                            style={{
                              padding: "4px",
                              backgroundColor: "transparent",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              color: "#2563eb",
                              transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#1d4ed8"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "#2563eb"
                            }}
                          >
                            <Folder style={{ height: "16px", width: "16px" }} />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onReportSelect(item.path)
                              }}
                              style={{
                                padding: "4px",
                                backgroundColor: "transparent",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                color: "#2563eb",
                                transition: "color 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#1d4ed8"
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#2563eb"
                              }}
                            >
                              <Play style={{ height: "16px", width: "16px" }} />
                            </button>
                            <button
                              style={{
                                padding: "4px",
                                backgroundColor: "transparent",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                color: "#6b7280",
                                transition: "color 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#374151"
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#6b7280"
                              }}
                            >
                              <Info style={{ height: "16px", width: "16px" }} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
