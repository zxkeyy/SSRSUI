"use client"

import React, { useState } from "react"
import type { PolicyInfo, RoleInfo, UserGroupPolicyItem } from "../types/api" // Import necessary types

// SecurityManagement Component
export const SecurityManagement = () => {
  const [selectedItemPath, setSelectedItemPath] = useState<string>("")
  const [policies, setPolicies] = useState<PolicyInfo[]>([])
  const [roles, setRoles] = useState<RoleInfo[]>([])
  const [userGroupPolicies, setUserGroupPolicies] = useState<UserGroupPolicyItem[]>([])
  const [searchUser, setSearchUser] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showAddPolicy, setShowAddPolicy] = useState<boolean>(false)
  const [newPolicy, setNewPolicy] = useState<PolicyInfo>({ groupUserName: "", roles: [] })

  // Load available roles on component mount
  React.useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      const rolesData: RoleInfo[] = await ssrsApi.listRoles()
      setRoles(rolesData)
    } catch (err: any) {
      setError("Failed to load roles: " + err.message)
    }
  }

  const loadPolicies = async () => {
    if (!selectedItemPath.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      const policiesData: PolicyInfo[] = await ssrsApi.getPolicies(selectedItemPath)
      setPolicies(policiesData)
    } catch (err: any) {
      setError("Failed to load policies: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const savePolicies = async () => {
    if (!selectedItemPath.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      await ssrsApi.setPolicies(selectedItemPath, policies)
      setSuccess("Policies updated successfully")
    } catch (err: any) {
      setError("Failed to save policies: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const searchUserPolicies = async () => {
    if (!searchUser.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      const userPoliciesRaw = await ssrsApi.getUserGroupPolicies(searchUser)
      const userPolicies: UserGroupPolicyItem[] = userPoliciesRaw.map((item: any) => ({
        ...item,
        itemType: item.itemType === "Report" ? "Report" : "Folder"
      }))
      setUserGroupPolicies(userPolicies)
    } catch (err: any) {
      setError("Failed to search user policies: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const addPolicy = () => {
    if (!newPolicy.groupUserName.trim() || newPolicy.roles.length === 0) return

    const exists = policies.find(p => p.groupUserName === newPolicy.groupUserName)
    if (exists) {
      exists.roles = [...new Set([...exists.roles, ...newPolicy.roles])]
    } else {
      setPolicies([...policies, { ...newPolicy }])
    }

    setNewPolicy({ groupUserName: "", roles: [] })
    setShowAddPolicy(false)
  }

  const removePolicy = (index: number) => {
    setPolicies(policies.filter((_, i) => i !== index))
  }

  const updatePolicyRoles = (index: number, newRoles: string[]) => {
    const updatedPolicies = [...policies]
    updatedPolicies[index].roles = newRoles
    setPolicies(updatedPolicies)
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Item Policies Management */}
      <div className="professional-card" style={{ padding: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "16px" }}>
          Item Security Policies
        </h2>

        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <input
            type="text"
            value={selectedItemPath}
            onChange={(e) => setSelectedItemPath(e.target.value)}
            placeholder="Enter item path (e.g., /Reports/MyReport)"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "14px"
            }}
          />
          <button
            onClick={loadPolicies}
            disabled={isLoading || !selectedItemPath.trim()}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              background: isLoading || !selectedItemPath.trim() ? "#94a3b8" : "#2563eb",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: isLoading || !selectedItemPath.trim() ? "not-allowed" : "pointer"
            }}
          >
            Load Policies
          </button>
        </div>

        {success && (
          <div style={{
            padding: "12px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "6px",
            color: "#16a34a",
            fontSize: "14px",
            marginBottom: "16px"
          }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{
            padding: "12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            color: "#dc2626",
            fontSize: "14px",
            marginBottom: "16px"
          }}>
            Error: {error}
          </div>
        )}

        {policies.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>
                Current Policies
              </h3>
              <button
                onClick={() => setShowAddPolicy(true)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Add Policy
              </button>
            </div>

            <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
              {policies.map((policy: PolicyInfo, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: "16px",
                    border: "1px solid #e0e3e7",
                    borderRadius: "6px",
                    backgroundColor: "#fff"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>
                        {policy.groupUserName}
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        Roles: {policy.roles.join(", ")}
                      </div>
                    </div>
                    <button
                      onClick={() => removePolicy(index)}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>
                      Roles:
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {roles.map((role: RoleInfo) => (
                        <label key={role.name} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                          <input
                            type="checkbox"
                            checked={policy.roles.includes(role.name)}
                            onChange={(e) => {
                              const newRoles = e.target.checked
                                ? [...policy.roles, role.name]
                                : policy.roles.filter(r => r !== role.name)
                              updatePolicyRoles(index, newRoles)
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

            <button
              onClick={savePolicies}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? "Saving..." : "Save Policies"}
            </button>
          </div>
        )}
      </div>

      {/* User/Group Policy Search */}
      <div className="professional-card" style={{ padding: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "16px" }}>
          User/Group Policy Search
        </h2>

        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Enter username or group name"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "14px"
            }}
          />
          <button
            onClick={searchUserPolicies}
            disabled={isLoading || !searchUser.trim()}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              background: isLoading || !searchUser.trim() ? "#94a3b8" : "#2563eb",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: isLoading || !searchUser.trim() ? "not-allowed" : "pointer"
            }}
          >
            Search
          </button>
        </div>

        {userGroupPolicies.length > 0 && (
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
              Policies for "{searchUser}" ({userGroupPolicies.length} items)
            </h3>
            <div style={{ display: "grid", gap: "12px" }}>
              {userGroupPolicies.map((item: UserGroupPolicyItem, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: "12px",
                    border: "1px solid #e0e3e7",
                    borderRadius: "6px",
                    backgroundColor: "#fff"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span>{item.itemType === "Report" ? "📊" : "📁"}</span>
                    <span style={{ fontWeight: "500" }}>{item.itemPath}</span>
                    <span style={{
                      padding: "2px 8px",
                      fontSize: "12px",
                      backgroundColor: item.itemType === "Report" ? "#dbeafe" : "#f3f4f6",
                      color: item.itemType === "Report" ? "#1e40af" : "#374151",
                      borderRadius: "12px"
                    }}>
                      {item.itemType}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    Roles: {item.roles.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Available Roles */}
      <div className="professional-card" style={{ padding: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "16px" }}>
          Available Roles
        </h2>

        <div style={{ display: "grid", gap: "12px" }}>
          {roles.map((role: RoleInfo) => (
            <div
              key={role.name}
              style={{
                padding: "12px",
                border: "1px solid #e0e3e7",
                borderRadius: "6px",
                backgroundColor: "#fff"
              }}
            >
              <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>
                {role.name}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                {role.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Policy Dialog */}
      {showAddPolicy && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            width: "500px",
            maxWidth: "90vw"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Add New Policy</h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500" }}>
                User/Group Name *
              </label>
              <input
                type="text"
                value={newPolicy.groupUserName}
                onChange={(e) => setNewPolicy({ ...newPolicy, groupUserName: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Roles *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {roles.map((role: RoleInfo) => (
                  <label key={role.name} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                    <input
                      type="checkbox"
                      checked={newPolicy.roles.includes(role.name)}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...newPolicy.roles, role.name]
                          : newPolicy.roles.filter(r => r !== role.name)
                        setNewPolicy({ ...newPolicy, roles: newRoles })
                      }}
                    />
                    {role.name}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowAddPolicy(false)
                  setNewPolicy({ groupUserName: "", roles: [] })
                }}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={addPolicy}
                disabled={!newPolicy.groupUserName.trim() || newPolicy.roles.length === 0}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: !newPolicy.groupUserName.trim() || newPolicy.roles.length === 0 ? "not-allowed" : "pointer",
                  opacity: !newPolicy.groupUserName.trim() || newPolicy.roles.length === 0 ? 0.6 : 1
                }}
              >
                Add Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}