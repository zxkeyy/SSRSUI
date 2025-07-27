"use client"

import { useState } from "react"
import { useSSRSBrowser } from "../hooks/useSSRS"
import type { FolderItem, ReportItem, CreateFolderRequest, MoveItemRequest } from "../types/api"

// FolderManagement Component
export const FolderManagement = ({  }: { onPathChange: (path: string) => void }) => {
  const [currentPath, setCurrentPath] = useState<string>("/")
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false)
  const [showMoveDialog, setShowMoveDialog] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<(FolderItem | ReportItem | null)>(null)
  const [createForm, setCreateForm] = useState<{ folderName: string; description: string }>({ folderName: "", description: "" })
  const [moveForm, setMoveForm] = useState<{ targetPath: string }>({ targetPath: "" })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { folderData } = useSSRSBrowser(currentPath)

  const handleCreateFolder = async () => {
    if (!createForm.folderName.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      const request: CreateFolderRequest = {
        parentPath: currentPath,
        folderName: createForm.folderName,
        description: createForm.description
      }
      await ssrsApi.createFolder(request)
      setSuccess("Folder created successfully")
      setShowCreateDialog(false)
      setCreateForm({ folderName: "", description: "" })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async (itemPath: string, isFolder: boolean) => {
    if (!confirm(`Are you sure you want to delete this ${isFolder ? "folder" : "report"}?`)) return

    setIsLoading(true)
    setError(null)

    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      if (isFolder) {
        await ssrsApi.deleteFolder(itemPath)
      } else {
        await ssrsApi.deleteReport(itemPath)
      }
      setSuccess(`${isFolder ? "Folder" : "Report"} deleted successfully`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoveItem = async () => {
    if (!selectedItem || !moveForm.targetPath.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      const request: MoveItemRequest = {
        itemPath: selectedItem.path,
        targetPath: moveForm.targetPath
      }
      await ssrsApi.moveItem(request)
      setSuccess("Item moved successfully")
      setShowMoveDialog(false)
      setSelectedItem(null)
      setMoveForm({ targetPath: "" })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="professional-card" style={{ padding: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
            Folder Management
          </h2>
          <button
            onClick={() => setShowCreateDialog(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Create Folder
          </button>
        </div>

        {/* Breadcrumb */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px" }}>
            <button
              onClick={() => setCurrentPath("/")}
              style={{
                background: "none",
                border: "none",
                color: "#3b82f6",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px"
              }}
            >
              Root
            </button>
            {currentPath.split("/").filter(Boolean).map((part, index, parts) => (
              <span key={index} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ margin: "0 4px", color: "#64748b" }}>/</span>
                <button
                  onClick={() => setCurrentPath("/" + parts.slice(0, index + 1).join("/"))}
                  style={{
                    background: "none",
                    border: "none",
                    color: index === parts.length - 1 ? "#374151" : "#3b82f6",
                    cursor: index === parts.length - 1 ? "default" : "pointer",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontWeight: index === parts.length - 1 ? "600" : "normal"
                  }}
                >
                  {part}
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Success/Error Messages */}
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

        {/* Folder Contents */}
        <div style={{ display: "grid", gap: "12px" }}>
          {/* Up Navigation */}
          {currentPath !== "/" && (
            <div
              onClick={() => {
                const parentPath = currentPath.split("/").slice(0, -1).join("/") || "/"
                setCurrentPath(parentPath)
              }}
              style={{
                padding: "12px",
                border: "1px solid #e0e3e7",
                borderRadius: "6px",
                backgroundColor: "#f8fafc",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span style={{ fontWeight: "500" }}>.. (Up)</span>
            </div>
          )}

          {/* Folders */}
          {folderData?.folders?.map((folder: FolderItem) => (
            <div
              key={folder.path}
              style={{
                padding: "12px",
                border: "1px solid #e0e3e7",
                borderRadius: "6px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div
                onClick={() => setCurrentPath(folder.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  flex: 1
                }}
              >
                <div>
                  <div style={{ fontWeight: "500", color: "#374151" }}>{folder.name}</div>
                  {folder.description && (
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{folder.description}</div>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    setSelectedItem({ ...folder, type: "folder" })
                    setShowMoveDialog(true)
                  }}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Move
                </button>
                <button
                  onClick={() => handleDeleteItem(folder.path, true)}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Reports */}
          {folderData?.reports?.map((report: ReportItem) => (
            <div
              key={report.path}
              style={{
                padding: "12px",
                border: "1px solid #e0e3e7",
                borderRadius: "6px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                <div>
                  <div style={{ fontWeight: "500", color: "#374151" }}>{report.name}</div>
                  {report.description && (
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{report.description}</div>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    setSelectedItem({ ...report, type: "report" })
                    setShowMoveDialog(true)
                  }}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Move
                </button>
                <button
                  onClick={() => handleDeleteItem(report.path, false)}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Folder Dialog */}
      {showCreateDialog && (
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
            width: "400px",
            maxWidth: "90vw"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Create New Folder</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500" }}>
                Folder Name *
              </label>
              <input
                type="text"
                value={createForm.folderName}
                onChange={(e) => setCreateForm({ ...createForm, folderName: e.target.value })}
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
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500" }}>
                Description
              </label>
              <textarea
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  minHeight: "80px",
                  resize: "vertical"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowCreateDialog(false)
                  setCreateForm({ folderName: "", description: "" })
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
                onClick={handleCreateFolder}
                disabled={isLoading || !createForm.folderName.trim()}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isLoading || !createForm.folderName.trim() ? "not-allowed" : "pointer",
                  opacity: isLoading || !createForm.folderName.trim() ? 0.6 : 1
                }}
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Item Dialog */}
      {showMoveDialog && selectedItem && (
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
            width: "400px",
            maxWidth: "90vw"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
              Move {"folders" in selectedItem ? "Folder" : "Report"}
            </h3>
            <div style={{ marginBottom: "16px", fontSize: "14px", color: "#64748b" }}>
              Moving: <strong>{selectedItem.name}</strong>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500" }}>
                Target Path *
              </label>
              <input
                type="text"
                value={moveForm.targetPath}
                onChange={(e) => setMoveForm({ targetPath: e.target.value })}
                placeholder="/path/to/destination"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowMoveDialog(false)
                  setSelectedItem(null)
                  setMoveForm({ targetPath: "" })
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
                onClick={handleMoveItem}
                disabled={isLoading || !moveForm.targetPath.trim()}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isLoading || !moveForm.targetPath.trim() ? "not-allowed" : "pointer",
                  opacity: isLoading || !moveForm.targetPath.trim() ? 0.6 : 1
                }}
              >
                {isLoading ? "Moving..." : "Move"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}