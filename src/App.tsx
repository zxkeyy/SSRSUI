
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
        background: "#f8fafc",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
        color: "#1e293b",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .professional-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            border-radius: 8px;
            animation: fadeIn 0.4s ease-out;
          }
        `}
      </style>

      {/* Header */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          animation: "slideIn 0.4s ease-out"
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 4px 0",
                fontSize: "24px",
                fontWeight: "600",
                color: "#0f172a",
                letterSpacing: "-0.01em",
              }}
            >
              SSRS Report Manager
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#64748b",
                fontWeight: "400",
              }}
            >
              SQL Server Reporting Services
            </p>
          </div>
          <UserInfo />
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <BreadcrumbNavigation currentPath={currentPath} onPathChange={setCurrentPath} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Sidebar */}
          <div style={{ animation: "slideIn 0.4s ease-out 0.1s both" }}>
            <SidebarNavigation selectedPath={currentPath} onPathChange={setCurrentPath} />
          </div>

          {/* Main Content Area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              animation: "fadeIn 0.4s ease-out 0.2s both"
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
                minHeight: "500px",
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
