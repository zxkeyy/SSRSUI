"use client"

import { useState, useEffect, useCallback } from "react"
import { SidebarNavigation } from "./components/SidebarNavigation"
import { BreadcrumbNavigation } from "./components/BreadcrumbNavigation"
import { EnhancedReportBrowser } from "./components/EnhancedReportBrowser"
import { ReportPanel } from "./components/ReportPanel"
import { UserInfo } from "./components/UserInfo"
import { ConnectionStatus } from "./components/ConnectionStatus"
import { FileText, Settings, Key, Users, ListFilter, X, Menu } from "lucide-react"
import { ssrsApi } from "./services/ssrsApi"
import type { PolicyInfo, RoleInfo } from "./types/api"

function App() {
  const [currentPath, setCurrentPath] = useState("/")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"browse" | "settings">("browse")
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState<"globalSecurity" | "serverConfig" | "dataSources" | "auditLogs">("globalSecurity")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [favoriteReports, setFavoriteReports] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("favoriteReports")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem("favoriteReports", JSON.stringify(favoriteReports))
  }, [favoriteReports])

  const toggleFavoriteReport = (reportPath: string) => {
    setFavoriteReports((prev) =>
      prev.includes(reportPath)
        ? prev.filter((p) => p !== reportPath)
        : [...prev, reportPath]
    )
  }

  const [systemPolicies, setSystemPolicies] = useState<PolicyInfo[]>([])
  const [systemRoles, setSystemRoles] = useState<RoleInfo[]>([])
  const [isLoadingSystemPolicies, setIsLoadingSystemPolicies] = useState(false)
  const [systemPolicyError, setSystemPolicyError] = useState<string | null>(null)
  const [systemPolicySuccess, setSystemPolicySuccess] = useState<string | null>(null)

  const tabs = [
    { id: "browse", label: "Browse Reports", icon: FileText },
    { id: "settings", label: "System Settings", icon: Settings },
  ]

  const settingsSubTabs = [
    { id: "globalSecurity", label: "Global Security & Policies", icon: Key },
    { id: "serverConfig", label: "Server Configuration", icon: Settings },
    { id: "dataSources", label: "Data Source Management", icon: ListFilter },
    { id: "auditLogs", label: "Audit Logs", icon: Users },
  ]

  const fetchSystemPoliciesAndRoles = useCallback(async () => {
    setIsLoadingSystemPolicies(true)
    setSystemPolicyError(null)
    try {
      const [policiesData, { systemRoles: fetchedSystemRoles }] = await Promise.all([
        ssrsApi.getSystemPolicies(),
        ssrsApi.getAllRoles()
      ])
      setSystemPolicies(policiesData)
      setSystemRoles(fetchedSystemRoles)
    } catch (err: any) {
      setSystemPolicyError("Failed to load system security settings: " + err.message)
    } finally {
      setIsLoadingSystemPolicies(false)
    }
  }, [])

  const saveSystemPolicies = async () => {
    setIsLoadingSystemPolicies(true)
    setSystemPolicyError(null)
    setSystemPolicySuccess(null)
    try {
      await ssrsApi.setSystemPolicies(systemPolicies)
      setSystemPolicySuccess("System policies updated successfully!")
    } catch (err: any) {
      setSystemPolicyError("Failed to save system policies: " + err.message)
    } finally {
      setIsLoadingSystemPolicies(false)
    }
  }

  useEffect(() => {
    if (activeTab === "settings" && activeSettingsSubTab === "globalSecurity") {
      fetchSystemPoliciesAndRoles()
    }
  }, [activeTab, activeSettingsSubTab, fetchSystemPoliciesAndRoles])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
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
          @media (max-width: 768px) {
            .professional-card {
              border-radius: 0;
              box-shadow: none;
            }
            .main-content {
              flex-direction: column !important;
            }
            .sidebar {
              position: fixed;
              left: 0;
              top: 0;
              height: 100vh;
              width: 260px;
              z-index: 1000;
              transform: translateX(-100%);
              transition: transform 0.3s ease;
            }
            .sidebar.open {
              transform: translateX(0);
            }
            .hamburger {
              display: flex !important;
            }
            .main-area {
              width: 100% !important;
              margin: 0 !important;
            }
          }
          @media (min-width: 769px) {
            .hamburger {
              display: none !important;
            }
            .sidebar {
              transform: translateX(0) !important;
            }
          }
        `}
      </style>

      {/* Header */}
      <header
        style={{
          backgroundColor: "#f9fafb",
          borderBottom: "1px solid #e0e3e7",
          padding: "10px 16px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          animation: "slideIn 0.3s ease-out",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className="hamburger"
              onClick={toggleSidebar}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "none",
              }}
            >
              <Menu style={{ height: "20px", width: "20px", color: "#0f172a" }} />
            </button>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#0f172a",
                  letterSpacing: "-0.01em",
                }}
              >
                SSRS Report Manager
              </h1>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 400 }}>
                SQL Server Reporting Services
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
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
        className="main-content"
        style={{
          flex: 1,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        {/* Sidebar */}
        <aside
          className={`sidebar ${isSidebarOpen ? "open" : ""}`}
          style={{
            width: "100%",
            maxWidth: "260px",
            minWidth: "180px",
            background: "#f3f4f6",
            borderRight: "1px solid #e0e3e7",
            padding: "0",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          }}
        >
          {favoriteReports.length > 0 && (
            <div style={{ margin: "16px", marginBottom: 0, padding: "6px 0 2px 0" }}>
              <div style={{ fontWeight: 500, fontSize: 13, color: "#475569", marginBottom: 4, letterSpacing: 0.2 }}>Quick Access</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {favoriteReports.map((reportPath) => (
                  <div
                    key={reportPath}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      background: "#fff",
                      border: "1px solid #e0e3e7",
                      borderRadius: 6,
                      padding: "8px 10px",
                      fontSize: 13,
                      color: "#1e293b",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      transition: "background 0.15s, border 0.15s",
                      position: "relative",
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = "#f0f9ff"
                      e.currentTarget.style.borderColor = "#0ea5e9"
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "#fff"
                      e.currentTarget.style.borderColor = "#e0e3e7"
                    }}
                  >
                    <span
                      style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}
                      title={reportPath}
                      onClick={() => {
                        setSelectedReport(reportPath)
                        setCurrentPath(reportPath.substring(0, reportPath.lastIndexOf("/")) || "/")
                        setIsSidebarOpen(false)
                      }}
                    >
                      {reportPath.split("/").pop()}
                    </span>
                    <button
                      onClick={() => toggleFavoriteReport(reportPath)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        marginLeft: 6,
                        display: "flex",
                        alignItems: "center",
                        color: "#64748b",
                      }}
                      title="Remove from Quick Access"
                    >
                      <X style={{ height: 14, width: 14 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <SidebarNavigation selectedPath={currentPath} onPathChange={(path) => {
            setCurrentPath(path)
            setIsSidebarOpen(false)
          }} />
        </aside>

        {/* Main Content Area */}
        <main
          className="main-area"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "#f4f6f8",
            height: "100%",
          }}
        >
          {/* Tab Navigation */}
          <div className="professional-card" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              borderBottom: "1px solid #e0e3e7",
              gap: "8px",
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      padding: "10px 16px",
                      border: "none",
                      background: isActive ? "#fff" : "transparent",
                      color: isActive ? "#2563eb" : "#64748b",
                      fontSize: "13px",
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease",
                      flex: "1 1 auto",
                      minWidth: "120px",
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
                    <Icon style={{ height: "14px", width: "14px" }} />
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
              <div style={{ width: "100%", marginBottom: "16px" }}>
                <EnhancedReportBrowser 
                  currentPath={currentPath} 
                  onPathChange={setCurrentPath} 
                  onReportSelect={setSelectedReport} 
                  selectedReport={selectedReport} 
                  favoriteReports={favoriteReports}
                  onToggleFavorite={toggleFavoriteReport}
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
            <div className="professional-card" style={{ padding: "0", overflow: "hidden" }}>
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                borderBottom: "1px solid #e0e3e7", 
                padding: "8px 16px",
                gap: "8px",
              }}>
                {settingsSubTabs.map((subTab) => {
                  const Icon = subTab.icon;
                  const isActive = activeSettingsSubTab === subTab.id;
                  return (
                    <button
                      key={subTab.id}
                      onClick={() => setActiveSettingsSubTab(subTab.id as any)}
                      style={{
                        padding: "8px 12px",
                        border: "none",
                        background: isActive ? "#e0e7ff" : "transparent",
                        color: isActive ? "#2563eb" : "#64748b",
                        fontSize: "12px",
                        fontWeight: isActive ? 600 : 500,
                        cursor: "pointer",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s ease",
                        flex: "1 1 auto",
                        minWidth: "100px",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "#f3f6fa";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <Icon style={{ height: "14px", width: "14px" }} />
                      {subTab.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ padding: "16px" }}>
                {activeSettingsSubTab === "globalSecurity" && (
                  <div>
                    <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>
                      Global Security & System Policies
                    </h2>
                    {systemPolicySuccess && (
                      <div style={{
                        padding: "10px",
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "6px",
                        color: "#16a34a",
                        fontSize: "13px",
                        marginBottom: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                        {systemPolicySuccess}
                        <button onClick={() => setSystemPolicySuccess(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                          <X style={{ height: "14px", width: "14px" }} />
                        </button>
                      </div>
                    )}

                    {systemPolicyError && (
                      <div style={{
                        padding: "10px",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        color: "#dc2626",
                        fontSize: "13px",
                        marginBottom: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                        {systemPolicyError}
                        <button onClick={() => setSystemPolicyError(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                          <X style={{ height: "14px", width: "14px" }} />
                        </button>
                      </div>
                    )}
                    {isLoadingSystemPolicies ? (
                      <div style={{ textAlign: "center", padding: "16px" }}>Loading system security settings...</div>
                    ) : (
                      <>
                        <div style={{ marginBottom: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                            <h4 style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>System Policies</h4>
                            <button
                              onClick={() => {
                                const newPolicy: PolicyInfo = { groupUserName: "", roles: [] }
                                setSystemPolicies([...systemPolicies, newPolicy])
                              }}
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                            >
                              Add System Policy
                            </button>
                          </div>

                          {systemPolicies.length === 0 ? (
                            <div style={{ color: "#64748b", fontSize: "13px", textAlign: "center", padding: "16px" }}>
                              No system policies configured
                            </div>
                          ) : (
                            <div style={{ display: "grid", gap: "10px", overflowY: "auto" }}>
                              {systemPolicies.map((policy, index) => (
                                <div
                                  key={index}
                                  style={{
                                    padding: "10px",
                                    border: "1px solid #e0e3e7",
                                    borderRadius: "6px",
                                    backgroundColor: "#f8fafc",
                                  }}
                                >
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                                    <input
                                      type="text"
                                      value={policy.groupUserName}
                                      onChange={(e) => {
                                        const newPolicies = [...systemPolicies]
                                        newPolicies[index].groupUserName = e.target.value
                                        setSystemPolicies(newPolicies)
                                      }}
                                      placeholder="User/Group name (e.g., DOMAIN\\User)"
                                      style={{
                                        flex: 1,
                                        padding: "6px 8px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "4px",
                                        fontSize: "13px",
                                        minWidth: "150px",
                                      }}
                                    />
                                    <button
                                      onClick={() => setSystemPolicies(systemPolicies.filter((_, i) => i !== index))}
                                      style={{
                                        padding: "4px 8px",
                                        backgroundColor: "#dc2626",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>

                                  <div>
                                    <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "500" }}>
                                      System Roles:
                                    </label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                      {systemRoles.map((role) => (
                                        <label key={role.name} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                                          <input
                                            type="checkbox"
                                            checked={policy.roles.includes(role.name)}
                                            onChange={(e) => {
                                              const newPolicies = [...systemPolicies]
                                              if (e.target.checked) {
                                                newPolicies[index].roles = [...new Set([...policy.roles, role.name])]
                                              } else {
                                                newPolicies[index].roles = policy.roles.filter(r => r !== role.name)
                                              }
                                              setSystemPolicies(newPolicies)
                                            }}
                                          />
                                          {role.name}
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                          <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Available System Roles</h4>
                          <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #e0e3e7", borderRadius: "6px", padding: "8px" }}>
                            {systemRoles.length === 0 ? (
                              <div style={{ color: "#64748b", fontSize: "13px", textAlign: "center", padding: "8px" }}>
                                No system roles found.
                              </div>
                            ) : (
                              systemRoles.map((role) => (
                                <div
                                  key={role.name}
                                  style={{
                                    padding: "6px 0",
                                    borderBottom: "1px dashed #e0e3e7",
                                  }}
                                >
                                  <div style={{ fontSize: "13px", fontWeight: "500" }}>{role.name}</div>
                                  <div style={{ fontSize: "12px", color: "#64748b" }}>{role.description}</div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                          <button
                            onClick={saveSystemPolicies}
                            disabled={isLoadingSystemPolicies}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#2563eb",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: isLoadingSystemPolicies ? "not-allowed" : "pointer",
                              opacity: isLoadingSystemPolicies ? 0.6 : 1,
                              fontSize: "13px",
                            }}
                          >
                            {isLoadingSystemPolicies ? "Saving..." : "Save System Policies"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeSettingsSubTab === "serverConfig" && (
                  <div>
                    <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>
                      Server Configuration
                    </h2>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>
                      <p>Details for server-level settings and configurations.</p>
                      <ul style={{ marginTop: "12px", paddingLeft: "16px" }}>
                        <li>General server properties</li>
                        <li>Performance settings</li>
                        <li>Database connection settings</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSettingsSubTab === "dataSources" && (
                  <div>
                    <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>
                      Data Source Management
                    </h2>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>
                      <p>Manage shared data sources used by reports.</p>
                      <ul style={{ marginTop: "12px", paddingLeft: "16px" }}>
                        <li>Add, edit, or delete shared data sources</li>
                        <li>Configure connection strings and credentials</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSettingsSubTab === "auditLogs" && (
                  <div>
                    <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>
                      Audit Logs
                    </h2>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>
                      <p>Review system and user activity logs.</p>
                      <ul style={{ marginTop: "12px", paddingLeft: "16px" }}>
                        <li>View recent actions and events</li>
                        <li>Filter and search log entries</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App