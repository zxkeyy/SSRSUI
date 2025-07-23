
"use client"

import type React from "react"
import { File, Folder, Calendar } from "lucide-react"
import { useSSRSBrowser } from "../hooks/useSSRS"

interface ReportBrowserProps {
  currentPath: string;
  onPathChange: (path: string) => void;
  onReportSelect: (reportPath: string) => void;
}

export const ReportBrowser: React.FC<ReportBrowserProps> = ({
  currentPath,
  onPathChange,
  onReportSelect
}) => {
  const { folderData, isLoading } = useSSRSBrowser(currentPath)

  return (
    <div className="professional-card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "20px" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#0f172a",
            marginBottom: "16px",
            letterSpacing: "-0.01em",
          }}
        >
          Browse Reports
        </h2>

        {isLoading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "200px" 
          }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                border: "2px solid #e2e8f0",
                borderTop: "2px solid #64748b",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {folderData?.folders?.map((folder) => (
              <div
                key={folder.path}
                onClick={() => onPathChange(folder.path)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc"
                  e.currentTarget.style.borderColor = "#e2e8f0"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.borderColor = "transparent"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                  <Folder style={{ 
                    marginRight: "10px", 
                    height: "16px", 
                    width: "16px", 
                    color: "#64748b" 
                  }} />
                  <span style={{ 
                    fontSize: "14px", 
                    fontWeight: "500", 
                    color: "#0f172a" 
                  }}>
                    {folder.name}
                  </span>
                </div>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px",
                  fontSize: "12px",
                  color: "#64748b",
                  marginLeft: "26px"
                }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Calendar style={{ marginRight: "4px", height: "12px", width: "12px" }} />
                    {new Date(folder.createdDate).toLocaleDateString()}
                  </div>
                  {/* createdBy property does not exist, so removed */}
                </div>
              </div>
            ))}

            {folderData?.reports?.map((report) => (
              <div
                key={report.path}
                onClick={() => onReportSelect(report.path)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f9ff"
                  e.currentTarget.style.borderColor = "#e0f2fe"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.borderColor = "transparent"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                  <File style={{ 
                    marginRight: "10px", 
                    height: "16px", 
                    width: "16px", 
                    color: "#0ea5e9" 
                  }} />
                  <span style={{ 
                    fontSize: "14px", 
                    fontWeight: "500", 
                    color: "#0f172a" 
                  }}>
                    {report.name}
                  </span>
                </div>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px",
                  fontSize: "12px",
                  color: "#64748b",
                  marginLeft: "26px"
                }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Calendar style={{ marginRight: "4px", height: "12px", width: "12px" }} />
                    {new Date(report.modifiedDate).toLocaleDateString()}
                  </div>
                  {/* modifiedBy property does not exist, so removed */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
