import type React from "react"
import { useUserInfo } from "../hooks/useSSRS"

export const UserInfo: React.FC = () => {
  const { userInfo, isLoading, error } = useUserInfo()

  if (isLoading) {
    return (
      <div
        style={{
          padding: "8px 16px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          fontSize: "14px",
          color: "#6b7280",
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
          padding: "8px 16px",
          backgroundColor: "#fef2f2",
          borderRadius: "8px",
          fontSize: "14px",
          color: "#dc2626",
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
        gap: "12px",
        padding: "8px 16px",
        backgroundColor: "#f0f9ff",
        borderRadius: "8px",
        border: "1px solid #bae6fd",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        {userInfo.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div style={{ fontSize: "14px", fontWeight: "500", color: "#1f2937" }}>{userInfo.name}</div>
        <div style={{ fontSize: "12px", color: "#6b7280" }}>
          {userInfo.authenticationType} • {userInfo.isAuthenticated ? "Authenticated" : "Not Authenticated"}
        </div>
      </div>
    </div>
  )
}
