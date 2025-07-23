
"use client"

import React from "react"
import { useReportParameters } from "../hooks/useSSRS"
import type { ReportParameter } from "../types/api"
import { Settings, AlertCircle } from "lucide-react"

interface ReportParametersProps {
  reportPath: string | null
  onParametersChange: (parameters: Record<string, any>) => void
}

export const ReportParameters: React.FC<ReportParametersProps> = ({ 
  reportPath, 
  onParametersChange 
}) => {
  const { parameters, isLoading, error } = useReportParameters(reportPath)

  const handleParameterChange = (name: string, value: any) => {
    onParametersChange({ [name]: value })
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
          <Settings style={{ marginRight: "8px", height: "18px", width: "18px", color: "#64748b" }} />
          Report Parameters
        </h2>

        {!reportPath ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px 20px",
            color: "#64748b",
            fontSize: "14px"
          }}>
            <AlertCircle style={{ 
              marginBottom: "12px", 
              height: "32px", 
              width: "32px", 
              color: "#94a3b8",
              margin: "0 auto 12px"
            }} />
            <p>Select a report to configure parameters</p>
          </div>
        ) : isLoading ? (
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
        ) : error ? (
          <div style={{ 
            padding: "16px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            color: "#dc2626",
            fontSize: "14px"
          }}>
            <AlertCircle style={{ marginRight: "8px", height: "16px", width: "16px", display: "inline" }} />
            Error loading parameters: {error}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {parameters?.map((param: ReportParameter) => (
              <div key={param.name}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  {param.prompt || param.name}
                  {/* Removed allowNull check as it does not exist on ReportParameter */}
                </label>
                <input
                  type={param.type === "DateTime" ? "datetime-local" : "text"}
                  defaultValue={param.defaultValue}
                  onChange={(e) => handleParameterChange(param.name, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "#ffffff",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0ea5e9"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
                {param.validValues && param.validValues.length > 0 && (
                  <div style={{ 
                    marginTop: "6px",
                    fontSize: "12px",
                    color: "#6b7280"
                  }}>
                    Valid values: {param.validValues.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
