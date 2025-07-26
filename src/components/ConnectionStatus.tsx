"use client"

import type React from "react"
import { useSSRSConnection } from "../hooks/useSSRS"

export const ConnectionStatus: React.FC = () => {
  const { connectionStatus, isLoading, error, testConnection } = useSSRSConnection()

  const getStatusColor = () => {
    if (error) return "#ef4444"
    if (connectionStatus) return "#10b981"
    return "#f59e0b"
  }

  const getStatusText = () => {
    if (error) return "Connection Failed"
    if (connectionStatus) return "Connected"
    return "Connecting..."
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "4px 10px 4px 8px",
        backgroundColor: "#f4f6f8",
        borderRadius: "5px",
        border: "1px solid #e0e3e7",
        fontSize: "13px",
        minHeight: 0,
        width: "100%"
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: getStatusColor(),
          marginRight: "8px",
          flexShrink: 0
        }}
      />
      <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0, flexWrap: "wrap", gap: 4 }}>
        <span style={{ fontWeight: 600, color: "#1e293b", minWidth: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "100%" }}>{getStatusText()}</span>
        {connectionStatus && (
          <span style={{ fontSize: "12px", color: "#64748b", marginLeft: 8, minWidth: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "100%" }}>
            ({connectionStatus.reportCount} reports, {connectionStatus.folderCount} folders)
          </span>
        )}
      </div>
      <button
        onClick={testConnection}
        disabled={isLoading}
        style={{
          padding: "2px 10px",
          fontSize: "12px",
          backgroundColor: isLoading ? "#a5b4fc" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.7 : 1,
          marginLeft: 12,
          height: 26,
          minWidth: 48
        }}
      >
        {isLoading ? "Testing..." : "Test"}
      </button>
    </div>
  )
}
