
"use client"

import type React from "react"
import { File, Folder, Calendar } from "lucide-react"
import { useSSRSBrowser } from "../hooks/useSSRS"

interface ReportBrowserProps {
  currentPath: string;
  onPathChange: (path: string) => void;
  onReportSelect: (reportPath: string) => void;
  selectedReport?: string | null;
}

export const ReportBrowser: React.FC<ReportBrowserProps> = ({
  currentPath,
  onPathChange,
  onReportSelect,
  selectedReport
}) => {
  const { folderData, isLoading } = useSSRSBrowser(currentPath)

  return (
    <div className="professional-card" style={{ overflow: "hidden", padding: 0 }}>
      <div style={{ padding: "14px 14px 10px 14px" }}>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: "10px",
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
            minHeight: "120px"
          }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #e2e8f0",
                borderTop: "2px solid #64748b",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
              width: "100%"
            }}
          >
            {folderData?.folders?.map((folder) => (
              <div
                key={folder.path}
                onClick={() => onPathChange(folder.path)}
                style={{
                  padding: "18px 18px 12px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: "1px solid #e0e8f0",
                  background: "#f8fafc",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                  minHeight: "90px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f6fa"
                  e.currentTarget.style.borderColor = "#2563eb"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc"
                  e.currentTarget.style.borderColor = "#e0e8f0"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <Folder style={{
                    marginRight: "10px",
                    height: "18px",
                    width: "18px",
                    color: "#64748b"
                  }} />
                  <span style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1e293b"
                  }}>
                    {folder.name}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12px",
                  color: "#64748b",
                  marginLeft: "28px"
                }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Calendar style={{ marginRight: "4px", height: "13px", width: "13px" }} />
                    {new Date(folder.createdDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}

            {folderData?.reports?.map((report) => {
              const isSelected = selectedReport === report.path;
              return (
                <div
                  key={report.path}
                  onClick={() => onReportSelect(report.path)}
                  style={{
                    padding: "18px 18px 12px 18px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: isSelected ? "2px solid #2563eb" : "1px solid #e0e8f0",
                    background: isSelected ? "#e0e7ff" : "#fff",
                    boxShadow: isSelected ? "0 2px 6px rgba(37,99,235,0.08)" : "0 1px 2px rgba(0,0,0,0.02)",
                    minHeight: "90px"
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "#f0f9ff"
                      e.currentTarget.style.borderColor = "#0ea5e9"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "#fff"
                      e.currentTarget.style.borderColor = "#e0e8f0"
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <File style={{
                      marginRight: "10px",
                      height: "18px",
                      width: "18px",
                      color: isSelected ? "#2563eb" : "#0ea5e9"
                    }} />
                    <span style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: isSelected ? "#2563eb" : "#1e293b"
                    }}>
                      {report.name}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "12px",
                    color: "#64748b",
                    marginLeft: "28px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Calendar style={{ marginRight: "4px", height: "13px", width: "13px" }} />
                      {new Date(report.modifiedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
