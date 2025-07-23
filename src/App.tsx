"use client"

import { useState } from "react"
import { SidebarNavigation } from "./components/SidebarNavigation"
import { BreadcrumbNavigation } from "./components/BreadcrumbNavigation"
import { ReportBrowser } from "./components/ReportBrowser"
import { ReportParameters } from "./components/ReportParameters"
import { ReportViewer } from "./components/ReportViewer"
import { UserInfo } from "./components/UserInfo"

function App() {
  const [currentPath, setCurrentPath] = useState("/")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [reportParameters, setReportParameters] = useState<Record<string, any>>({})

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
        `}
      </style>

      {/* Header */}
      <header
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "16px 24px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          
          margin: "0 auto",
          width: "100%",
          
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "",
          }}
        >
          <h1
            style={{
              margin: "0 0 4px 0",
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            SSRS Report Manager
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            Modern interface for SQL Server Reporting Services
          </p>
        </div>
        <UserInfo />
      </header>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <BreadcrumbNavigation currentPath={currentPath} onPathChange={setCurrentPath} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Sidebar */}
          <div>
            <SidebarNavigation selectedPath={currentPath} onPathChange={setCurrentPath} />
          </div>

          {/* Main Content Area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Report Browser */}
            <ReportBrowser currentPath={currentPath} onPathChange={setCurrentPath} onReportSelect={setSelectedReport} />

            {/* Report Parameters and Viewer */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                minHeight: "600px",
              }}
            >
              <ReportParameters reportPath={selectedReport} onParametersChange={setReportParameters} />
              <ReportViewer reportPath={selectedReport} parameters={reportParameters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
