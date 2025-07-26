
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
        background: "#f4f6f8",
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#1e293b",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .professional-card {
            background: #fff;
            border: 1px solid #e0e3e7;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
            border-radius: 6px;
            animation: fadeIn 0.3s ease-out;
          }
        `}
      </style>

      {/* Header */}
      <header
        style={{
          backgroundColor: "#f9fafb",
          borderBottom: "1px solid #e0e3e7",
          padding: "10px 32px 10px 20px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          animation: "slideIn 0.3s ease-out"
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "100vw"
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 600,
                color: "#0f172a",
                letterSpacing: "-0.01em",
              }}
            >
              SSRS Report Manager
            </h1>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 400 }}>
              SQL Server Reporting Services
            </span>
          </div>
          <UserInfo />
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          width: "100vw",
          minHeight: "calc(100vh - 60px)",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: 220,
            minWidth: 180,
            maxWidth: 260,
            background: "#f3f4f6",
            borderRight: "1px solid #e0e3e7",
            padding: "0 0 0 0",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          }}
        >
          <SidebarNavigation selectedPath={currentPath} onPathChange={setCurrentPath} />
        </aside>

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: "24px 24px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            background: "#f4f6f8",
            height: "100%"
          }}
        >
          <BreadcrumbNavigation currentPath={currentPath} onPathChange={setCurrentPath} />
          {/* Report Browser - now full width grid */}
          <div style={{ width: "100%", marginBottom: "18px" }}>
            <ReportBrowser currentPath={currentPath} onPathChange={setCurrentPath} onReportSelect={setSelectedReport} />
          </div>

          {/* Report Parameters and Viewer */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
              minHeight: "420px",
              height: "100%"
            }}
          >
            <ReportParameters reportPath={selectedReport} onParametersChange={setReportParameters} />
            <ReportViewer reportPath={selectedReport} parameters={reportParameters} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
