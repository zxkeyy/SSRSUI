"use client"

import React from "react"
import { useReportParameters } from "../hooks/useSSRS"
import type { ReportParameter } from "../types/api"

interface ReportParametersProps {
  reportPath: string | null
  onParametersChange: (parameters: Record<string, any>) => void
}

export const ReportParameters: React.FC<ReportParametersProps> = ({ reportPath, onParametersChange }) => {
  const { parameters, parameterValues, isLoading, error, updateParameterValue, resetParameters } =
    useReportParameters(reportPath)

  React.useEffect(() => {
    onParametersChange(parameterValues)
  }, [parameterValues, onParametersChange])

  const renderParameterInput = (param: ReportParameter) => {
    const value = parameterValues[param.name] || ""

    const inputStyle = {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      fontSize: "14px",
      backgroundColor: "white",
    }

    switch (param.type) {
      case "Boolean":
        return (
          <select
            value={value.toString()}
            onChange={(e) => updateParameterValue(param.name, e.target.value === "true")}
            style={inputStyle}
          >
            <option value="">Select...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        )

      case "DateTime":
        return (
          <input
            type="datetime-local"
            value={value ? new Date(value).toISOString().slice(0, 16) : ""}
            onChange={(e) => updateParameterValue(param.name, e.target.value ? new Date(e.target.value) : "")}
            style={inputStyle}
          />
        )

      case "Integer":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => updateParameterValue(param.name, Number.parseInt(e.target.value) || "")}
            style={inputStyle}
          />
        )

      case "Float":
        return (
          <input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => updateParameterValue(param.name, Number.parseFloat(e.target.value) || "")}
            style={inputStyle}
          />
        )

      default:
        if (param.validValues && param.validValues.length > 0) {
          if (param.multiValue) {
            return (
              <select
                multiple
                value={Array.isArray(value) ? value : []}
                onChange={(e) => {
                  const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value)
                  updateParameterValue(param.name, selectedValues)
                }}
                style={{ ...inputStyle, height: "120px" }}
              >
                {param.validValues.map((validValue) => (
                  <option key={validValue} value={validValue}>
                    {validValue}
                  </option>
                ))}
              </select>
            )
          } else {
            return (
              <select
                value={value}
                onChange={(e) => updateParameterValue(param.name, e.target.value)}
                style={inputStyle}
              >
                <option value="">Select...</option>
                {param.validValues.map((validValue) => (
                  <option key={validValue} value={validValue}>
                    {validValue}
                  </option>
                ))}
              </select>
            )
          }
        }

        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateParameterValue(param.name, e.target.value)}
            style={inputStyle}
          />
        )
    }
  }

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
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
        <h3 style={{ margin: "0 0 8px 0", color: "#374151" }}>Select a Report</h3>
        <p style={{ margin: 0 }}>Choose a report from the browser to view its parameters and generate output.</p>
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
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
        }}
      >
        <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>
          Report Parameters
        </h3>
        <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>{reportPath.split("/").pop()}</p>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        {isLoading && (
          <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>Loading parameters...</div>
        )}

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
            Error loading parameters: {error}
          </div>
        )}

        {parameters.length === 0 && !isLoading && !error && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#6b7280",
              backgroundColor: "#f9fafb",
              borderRadius: "4px",
            }}
          >
            This report has no parameters.
          </div>
        )}

        {parameters.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {parameters.map((param) => (
              <div key={param.name}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  {param.prompt || param.name}
                  {!param.nullable && <span style={{ color: "#dc2626" }}>*</span>}
                </label>

                {renderParameterInput(param)}

                <div style={{ marginTop: "4px", fontSize: "12px", color: "#6b7280" }}>
                  Type: {param.type}
                  {param.multiValue && " (Multiple values)"}
                  {param.nullable && " (Optional)"}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button
                onClick={resetParameters}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
