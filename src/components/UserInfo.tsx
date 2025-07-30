import type React from "react"
import { useSSRSConnection } from "../hooks/useSSRS"

export const UserInfo: React.FC = () => {
  const { userInfo, isConnecting, error } = useSSRSConnection()

  if (isConnecting) {
    return (
      <div
        style={{
          padding: "6px 12px",
          backgroundColor: "#f8fafc",
          borderRadius: "6px",
          fontSize: "13px",
          color: "#6b7280",
          maxWidth: "100%",
          boxSizing: "border-box",
          flexShrink: 1,
        }}
      >
        Loading user info...
      </div>
    )
  }

  if (error || !userInfo) {
    return (
      <div
        style={{
          padding: "6px 12px",
          backgroundColor: "#fef2f2",
          borderRadius: "6px",
          fontSize: "13px",
          color: "#dc2626",
          maxWidth: "100%",
          boxSizing: "border-box",
          flexShrink: 1,
        }}
      >
        User info unavailable
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        backgroundColor: "#f0f9ff",
        borderRadius: "6px",
        border: "1px solid #bae6fd",
        maxWidth: "100%",
        boxSizing: "border-box",
        flexShrink: 1,
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: "600",
          flexShrink: 0,
        }}
      >
        {userInfo.name.charAt(0).toUpperCase()}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: "13px", fontWeight: "500", color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {userInfo.name}
        </div>
        <div style={{ fontSize: "11px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {userInfo.authenticationType} • {userInfo.isAuthenticated ? "Authenticated" : "Not Authenticated"}
        </div>
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="padding: 6px 12px"] {
              padding: 4px 8px;
              font-size: 12px;
            }
            div[style*="width: 28px"] {
              width: 24px;
              height: 24px;
              font-size: 12px;
            }
            div[style*="font-size: 13px"][style*="fontWeight: 500"] {
              font-size: 12px;
            }
            div[style*="font-size: 11px"] {
              font-size: 10px;
            }
          }
          @media (max-width: 480px) {
            div[style*="display: flex"][style*="gap: 8px"] {
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;
              padding: 4px 6px;
            }
            div[style*="width: 28px"] {
              width: 20px;
              height: 20px;
              font-size: 11px;
            }
          }
        `}
      </style>
    </div>
  )
}