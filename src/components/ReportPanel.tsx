"use client"

import React, { useState } from "react"
import { useReportParameters, useReportRenderer } from "../hooks/useSSRS"
import type { RenderFormat } from "../types/api"
import { Settings, Download, FileText, AlertCircle } from "lucide-react"

interface ReportPanelProps {
  reportPath: string | null
}

const formatOptions: { value: RenderFormat; label: string; ext: string }[] = [
  { value: "PDF", label: "PDF Document", ext: ".pdf" },
  { value: "EXCEL", label: "Excel Spreadsheet", ext: ".xlsx" },
  { value: "WORD", label: "Word Document", ext: ".docx" },
  { value: "CSV", label: "CSV Data", ext: ".csv" },
  { value: "XML", label: "XML Data", ext: ".xml" },
  { value: "IMAGE", label: "Image", ext: ".png" },
];

export const ReportPanel: React.FC<ReportPanelProps> = ({ reportPath }) => {
  const {
    parameters,
    parameterValues,
    isLoading: paramsLoading,
    isReady: paramsReady,
    error: paramsError,
    updateParameterValue,
    // resetParameters
  } = useReportParameters(reportPath)
  const [selectedFormat, setSelectedFormat] = useState<RenderFormat>("PDF")
  const { downloadReport, renderReport, isRendering, error: renderError } = useReportRenderer()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  const handleParameterChange = (name: string, value: any) => {
    updateParameterValue(name, value)
  }

  const allParamsFilled = parameters.length === 0 || parameters.every(
    (param) => {
      const required = param.nullable === false;
      const value = parameterValues[param.name];
      if (!required) return true;
      if (value === undefined || value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    }
  );

  const handleDownload = async () => {
    if (!reportPath || !allParamsFilled) return
    await downloadReport(reportPath, parameterValues, selectedFormat)
  }

  const handlePreview = async () => {
    if (!reportPath || !allParamsFilled) return;
    setPreviewLoading(true);
    const blob = await renderReport(reportPath, parameterValues, "PDF");
    if (blob) {
      setPreviewUrl(URL.createObjectURL(blob));
    }
    setPreviewLoading(false);
  };

  React.useEffect(() => {
    setPreviewUrl(null);
    // eslint-disable-next-line
  }, [reportPath]);

  React.useEffect(() => {
    if (reportPath && allParamsFilled && paramsReady) handlePreview();
    // eslint-disable-next-line
  }, [JSON.stringify(parameterValues), allParamsFilled, paramsReady]);

  // Get the report title from the path (last segment)
  const reportTitle = reportPath ? reportPath.split("/").filter(Boolean).pop() : null;

  return (
    <div className="professional-card" style={{ overflow: "hidden", padding: 0, minHeight: 420 }}>
      {/* Report Title Header */}
      {reportTitle && (
        <div style={{
          padding: "18px 18px 18px 18px",
          borderBottom: "1px solid #e0e8f0",
          marginBottom: 0,
          background: "#f9fafb"
        }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#1e293b",
            margin: 0,
            letterSpacing: "-0.01em",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap"
          }}>{reportTitle}</h2>
        </div>
      )}
      <div style={{ padding: "18px 18px 0 18px" }}>
        {/* Header: Parameters and Download */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24, marginBottom: 18 }}>
          {/* Parameters */}
          <div style={{ flex: 2, minWidth: 220, alignSelf: "stretch" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 8, display: "flex", alignItems: "center" }}>
              <Settings style={{ marginRight: 7, height: 17, width: 17, color: "#64748b" }} />
              Parameters
            </h3>
            {paramsLoading ? (
              <div style={{ color: "#64748b", fontSize: 14 }}>Loading parameters...</div>
            ) : paramsError ? (
              <div style={{ color: "#dc2626", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertCircle style={{ height: 16, width: 16 }} />
                {paramsError}
              </div>
            ) : parameters.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: 14 }}>No parameters</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {parameters.map((param) => (
                  <div key={param.name} style={{ minWidth: 120, flex: 1 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4, display: "block" }}>
                      {param.prompt || param.name}
                    </label>
                    <input
                      type={param.type === "DateTime" ? "datetime-local" : "text"}
                      value={parameterValues[param.name] ?? ""}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 5,
                        border: "1px solid #d1d5db",
                        fontSize: 14,
                        backgroundColor: "#fff",
                        marginBottom: 2
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Download/Format */}
          <div style={{ flex: 1, minWidth: 180, alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 8, display: "flex", alignItems: "center" }}>
              <FileText style={{ marginRight: 7, height: 17, width: 17, color: "#64748b" }} />
              Export
            </h3>
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="export-format" style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4, display: "block" }}>
                Format
              </label>
              <select
                id="export-format"
                value={selectedFormat}
                onChange={e => setSelectedFormat(e.target.value as RenderFormat)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 5,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                  backgroundColor: "#fff",
                  color: "#1e293b",
                  fontWeight: 500,
                  marginBottom: 2
                }}
              >
                {formatOptions.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.label} ({format.ext.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleDownload}
              disabled={isRendering || !allParamsFilled}
              title={
                !allParamsFilled
                  ? "Please provide all required parameters to enable download."
                  : isRendering
                  ? "Report is being generated."
                  : ""
              }
              style={{
                padding: "10px 0",
                borderRadius: 5,
                border: "none",
                background: isRendering || !allParamsFilled ? "#e5e7eb" : "#2563eb",
                color: isRendering || !allParamsFilled ? "#64748b" : "white",
                fontSize: 15,
                fontWeight: 600,
                cursor: isRendering || !allParamsFilled ? "" : "pointer",
                marginTop: 8,
                width: "100%",
                opacity: isRendering || !allParamsFilled ? 0.7 : 1,
                boxShadow: !allParamsFilled ? "0 0 0 2px #fca5a5" : undefined,
                transition: "box-shadow 0.2s, background 0.2s, color 0.2s, opacity 0.2s"
              }}
            >
              {isRendering
                ? "Generating..."
                : <><Download style={{ height: 16, width: 16, marginRight: 8 }} />Download</>}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {renderError && allParamsFilled && (
          <div style={{ padding: 12, backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, color: "#dc2626", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle style={{ height: 16, width: 16, flexShrink: 0 }} />
            {renderError}
          </div>
        )}

        {/* Report Preview */}
        <div style={{ marginTop: 18, minHeight: screen.height, background: "#f8fafc", borderRadius: 6, border: "1px solid #e0e8f0", padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {!reportPath ? (
            <div style={{ color: "#64748b", fontSize: 15, textAlign: "center" }}>Select a report to preview</div>
          ) : !allParamsFilled ? (
            <div style={{ color: "#64748b", fontSize: 15, textAlign: "center" }}>Please provide all required parameters to preview the report.</div>
          ) : previewLoading ? (
            <div style={{ color: "#64748b", fontSize: 15 }}>Loading preview...</div>
          ) : previewUrl ? (
            <>
              <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                <button
                  onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 5,
                    border: "1px solid #2563eb",
                    background: "#fff",
                    color: "#2563eb",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    marginBottom: 2
                  }}
                  title="Open in new tab"
                >
                  Open in New Tab
                </button>
              </div>
              <iframe
                title="Report Preview"
                src={previewUrl}
                style={{ width: "100%", minHeight: screen.height, height: "130vh", border: "none", borderRadius: 4, background: "#fff" }}
              />
            </>
          ) : (
            <div style={{ color: "#64748b", fontSize: 15 }}>No preview available</div>
          )}
        </div>
      </div>
    </div>
  )
}
