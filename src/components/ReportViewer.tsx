"use client"

import React, { useState } from "react"
import { useReportRenderer } from "../hooks/useSSRS"
import type { RenderFormat } from "../types/api"

interface ReportViewerProps {
  reportPath: string | null
  parameters: Record<string, any>
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ reportPath, parameters }) => {
  const { isRendering, error, renderReport, downloadReport } = useReportRenderer()
  const [selectedFormat, setSelectedFormat] = useState<RenderFormat>("PDF")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const formats: { value: RenderFormat; label: string }[] = [
    { value: "PDF", label: "PDF" },
    { value: "EXCEL", label: "Excel" },
    { value: "WORD", label: "Word" },
    { value: "CSV", label: "CSV" },
    { value: "XML", label: "XML" },
    { value: "IMAGE", label: "Image" },
  ]

  const handlePreview = async () => {
    if (!reportPath) return

    try {
      const blob = await renderReport(reportPath, parameters, selectedFormat)
      if (blob) {
        // Clean up previous URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }

        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
      }
    } catch (err) {
      console.error("Preview failed:", err)
    }
  }

  const handleDownload = async () => {
    if (!reportPath) return

    try {
      await downloadReport(reportPath, parameters, selectedFormat)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  React.useEffect(() => {
    // Clean up URL when component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (!reportPath) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#6b7280",
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
        <h3 style={{ margin: "0 0 8px 0", color: "#374151" }}>Ready to Generate</h3>
        <p style={{ margin: 0 }}>Configure parameters and click "Preview" or "Download" to generate your report.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>Report Output</h3>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Format:</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as RenderFormat)}
              style={{
                padding: "6px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "14px",
                backgroundColor: "white",
              }}
            >
              {formats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handlePreview}
              disabled={isRendering}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isRendering ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                opacity: isRendering ? 0.6 : 1,
              }}
            >
              {isRendering ? "Generating..." : "Preview"}
            </button>

            <button
              onClick={handleDownload}
              disabled={isRendering}
              style={{
                padding: "8px 16px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isRendering ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                opacity: isRendering ? 0.6 : 1,
              }}
            >
              {isRendering ? "Generating..." : "Download"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        {error && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            Error: {error}
          </div>
        )}

        {isRendering && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #e5e7eb",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "#6b7280", margin: 0 }}>Generating report...</p>
          </div>
        )}

        {previewUrl && selectedFormat === "PDF" && (
          <iframe
            src={previewUrl}
            style={{
              width: "100%",
              height: "600px",
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
            }}
            title="Report Preview"
          />
        )}

        {previewUrl && selectedFormat === "IMAGE" && (
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Report Preview"
            style={{
              maxWidth: "100%",
              height: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
            }}
          />
        )}

        {previewUrl && !["PDF", "IMAGE"].includes(selectedFormat) && (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              backgroundColor: "#f9fafb",
              borderRadius: "4px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
            <h4 style={{ margin: "0 0 8px 0", color: "#374151" }}>Report Generated</h4>
            <p style={{ margin: "0 0 16px 0", color: "#6b7280" }}>
              {selectedFormat} files cannot be previewed in the browser.
            </p>
            <button
              onClick={handleDownload}
              style={{
                padding: "8px 16px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Download File
            </button>
          </div>
        )}

        {!previewUrl && !isRendering && !error && (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#6b7280",
              backgroundColor: "#f9fafb",
              borderRadius: "4px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <h4 style={{ margin: "0 0 8px 0", color: "#374151" }}>No Preview Available</h4>
            <p style={{ margin: 0 }}>
              Click "Preview" to generate and view the report, or "Download" to save it directly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
