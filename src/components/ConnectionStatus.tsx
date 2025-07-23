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
        gap: "12px",
        padding: "8px 16px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: getStatusColor(),
          animation: isLoading ? "pulse 2s infinite" : "none",
        }}
      />
      <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>{getStatusText()}</span>
      {connectionStatus && (
        <span style={{ fontSize: "12px", color: "#6b7280" }}>
          ({connectionStatus.reportCount} reports, {connectionStatus.folderCount} folders)
        </span>
      )}
      <button
        onClick={testConnection}
        disabled={isLoading}
        style={{
          padding: "4px 8px",
          fontSize: "12px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? "Testing..." : "Test"}
      </button>
    </div>
  )
}
