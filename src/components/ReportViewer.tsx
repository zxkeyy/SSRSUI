
"use client"

import React, { useState } from "react"
import { useReportRenderer } from "../hooks/useSSRS"
import type { RenderFormat } from "../types/api"
import { Download, FileText, AlertCircle } from "lucide-react"

interface ReportViewerProps {
  reportPath: string | null
  parameters: Record<string, any>
}

const formatOptions: { value: RenderFormat; label: string; icon: string }[] = [
  { value: "PDF", label: "PDF Document", icon: "📄" },
  { value: "EXCEL", label: "Excel Spreadsheet", icon: "📊" },
  { value: "WORD", label: "Word Document", icon: "📝" },
  { value: "CSV", label: "CSV Data", icon: "📋" },
  { value: "XML", label: "XML Data", icon: "🔖" },
  { value: "IMAGE", label: "Image (PNG)", icon: "🖼️" },
]

export const ReportViewer: React.FC<ReportViewerProps> = ({ reportPath, parameters }) => {
  const [selectedFormat, setSelectedFormat] = useState<RenderFormat>("PDF")
  const { downloadReport, isRendering, error } = useReportRenderer()

  const handleDownload = async () => {
    if (!reportPath) return
    await downloadReport(reportPath, parameters, selectedFormat)
  }

  return (
    <div className="professional-card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "20px" }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#0f172a",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            letterSpacing: "-0.01em",
          }}
        >
          <FileText style={{ marginRight: "8px", height: "18px", width: "18px", color: "#64748b" }} />
          Report Viewer
        </h2>

        {!reportPath ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px 20px",
            color: "#64748b",
            fontSize: "14px"
          }}>
            <FileText style={{ 
              marginBottom: "12px", 
              height: "32px", 
              width: "32px", 
              color: "#94a3b8",
              margin: "0 auto 12px"
            }} />
            <p>Select a report to view and download</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Format Selection */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Export Format
              </label>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "8px" 
              }}>
                {formatOptions.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: selectedFormat === format.value 
                        ? "2px solid #0ea5e9" 
                        : "1px solid #d1d5db",
                      backgroundColor: selectedFormat === format.value
                        ? "#f0f9ff"
                        : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontSize: "13px",
                      fontWeight: "400",
                      color: selectedFormat === format.value ? "#0ea5e9" : "#374151",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedFormat !== format.value) {
                        e.currentTarget.style.backgroundColor = "#f8fafc"
                        e.currentTarget.style.borderColor = "#94a3b8"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedFormat !== format.value) {
                        e.currentTarget.style.backgroundColor = "#ffffff"
                        e.currentTarget.style.borderColor = "#d1d5db"
                      }
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>{format.icon}</span>
                    {format.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isRendering}
              style={{
                padding: "12px 20px",
                borderRadius: "6px",
                border: "none",
                background: isRendering ? "#94a3b8" : "#0ea5e9",
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                cursor: isRendering ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (!isRendering) {
                  e.currentTarget.style.backgroundColor = "#0284c7"
                }
              }}
              onMouseLeave={(e) => {
                if (!isRendering) {
                  e.currentTarget.style.backgroundColor = "#0ea5e9"
                }
              }}
            >
              {isRendering ? (
                <>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download style={{ height: "16px", width: "16px" }} />
                  Download {selectedFormat} Report
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div style={{ 
                padding: "12px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
                color: "#dc2626",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <AlertCircle style={{ height: "16px", width: "16px", flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Current Parameters Display */}
            {Object.keys(parameters).length > 0 && (
              <div style={{
                padding: "12px",
                backgroundColor: "#f0f9ff",
                border: "1px solid #e0f2fe",
                borderRadius: "6px",
              }}>
                <h4 style={{ 
                  fontSize: "13px", 
                  fontWeight: "500", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Current Parameters:
                </h4>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {Object.entries(parameters).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: "4px" }}>
                      <strong>{key}:</strong> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
