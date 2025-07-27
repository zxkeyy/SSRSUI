"use client"

import { useState } from "react"
import { SidebarNavigation } from "./components/SidebarNavigation"
import { BreadcrumbNavigation } from "./components/BreadcrumbNavigation"
import { EnhancedReportBrowser } from "./components/EnhancedReportBrowser"
import { ReportPanel } from "./components/ReportPanel"
import { UserInfo } from "./components/UserInfo"
import { ConnectionStatus } from "./components/ConnectionStatus"
import { FileText, Settings } from "lucide-react"

function App() {
  const [currentPath, setCurrentPath] = useState("/")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"browse" | "settings">("browse")

  const tabs = [
    { id: "browse", label: "Browse Reports", icon: FileText },
    { id: "settings", label: "System Settings", icon: Settings },
  ]

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 500,
              }}
            >
              <ConnectionStatus />
            </div>
            <UserInfo />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          width: "100%",
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
            padding: "10px 10px 10px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            background: "#f4f6f8",
            height: "100%"
          }}
        >
          {/* Tab Navigation */}
          <div className="professional-card" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #e0e3e7" }}>
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      padding: "12px 20px",
                      border: "none",
                      background: isActive ? "#fff" : "transparent",
                      color: isActive ? "#2563eb" : "#64748b",
                      fontSize: "14px",
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#374151"
                        e.currentTarget.style.backgroundColor = "#f8fafc"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#64748b"
                        e.currentTarget.style.backgroundColor = "transparent"
                      }
                    }}
                  >
                    <Icon style={{ height: "16px", width: "16px" }} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "browse" && (
            <>
              <BreadcrumbNavigation currentPath={currentPath} onPathChange={setCurrentPath} />
              <div style={{ width: "100%", marginBottom: "18px" }}>
                <EnhancedReportBrowser 
                  currentPath={currentPath} 
                  onPathChange={setCurrentPath} 
                  onReportSelect={setSelectedReport} 
                  selectedReport={selectedReport} 
                />
              </div>
              {selectedReport && (
                <div style={{ width: "100%" }}>
                  <ReportPanel reportPath={selectedReport} />
                </div>
              )}
            </>
          )}

          {activeTab === "settings" && (
            <div className="professional-card" style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "16px" }}>
                System Settings
              </h2>
              <div style={{ color: "#64748b", fontSize: "14px" }}>
                <p>System configuration and administrative settings will be available here.</p>
                <ul style={{ marginTop: "16px", paddingLeft: "20px" }}>
                  <li>Server configuration</li>
                  <li>Global security policies</li>
                  <li>Data source management</li>
                  <li>Backup and maintenance</li>
                  <li>Audit logs</li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App