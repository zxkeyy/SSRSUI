"use client"

import type React from "react"
import { useSSRSConnection } from "../hooks/useSSRS"

export const ConnectionStatus: React.FC = () => {
  const { connectionInfo, isConnecting, error, testConnection } = useSSRSConnection()

  const getStatusColor = () => {
    if (error) return "#ef4444"
    if (connectionInfo) return "#10b981"
    return "#f59e0b"
  }

  const getStatusText = () => {
    if (error) return "Connection Failed"
    if (connectionInfo) return "Connected"
    return "Connecting..."
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "4px 8px",
        backgroundColor: "#f4f6f8",
        borderRadius: "5px",
        border: "1px solid #e0e3e7",
        fontSize: "12px",
        minHeight: 0,
        maxWidth: "100%",
        boxSizing: "border-box",
        flexShrink: 1,
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: getStatusColor(),
          marginRight: "6px",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0, flexWrap: "wrap", gap: "4px" }}>
        <span style={{ fontWeight: 600, color: "#1e293b", minWidth: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
          {getStatusText()}
        </span>
        {connectionInfo && (
          <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "6px", minWidth: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            ({connectionInfo.reportCount} reports, {connectionInfo.folderCount} folders)
          </span>
        )}
      </div>
      <button
        onClick={testConnection}
        disabled={isConnecting}
        style={{
          padding: "2px 8px",
          fontSize: "11px",
          backgroundColor: isConnecting ? "#a5b4fc" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: isConnecting ? "not-allowed" : "pointer",
          opacity: isConnecting ? 0.7 : 1,
          marginLeft: "8px",
          height: "24px",
          minWidth: "40px",
          flexShrink: 0,
        }}
      >
        {isConnecting ? "Testing..." : "Test"}
      </button>
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="padding: 4px 8px"] {
              padding: 3px 6px;
              font-size: 11px;
            }
            div[style*="width: 8px"] {
              width: 6px;
              height: 6px;
              margin-right: 4px;
            }
            button[style*="padding: 2px 8px"] {
              padding: 2px 6px;
              font-size: 10px;
              height: 22px;
              min-width: 36px;
              margin-left: 6px;
            }
            span[style*="font-size: 11px"] {
              font-size: 10px;
              margin-left: 4px;
            }
          }
          @media (max-width: 480px) {
            div[style*="padding: 4px 8px"] {
              padding: 2px 4px;
            }
          }
        `}
      </style>
    </div>
  )
}