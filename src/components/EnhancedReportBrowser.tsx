"use client"

import React, { useState, useCallback } from "react"
import { 
  File, 
  Folder, 
  Calendar, 
  Search, 
  MoreVertical, 
  Plus,
  Move,
  Trash2,
  Shield,
  X,
} from "lucide-react"
import { useSSRSBrowser } from "../hooks/useSSRS"
import type { 
  FolderItem, 
  ReportItem, 
  CreateFolderRequest, 
  MoveItemRequest,
  PolicyInfo,
  RoleInfo,
  SearchResult
} from "../types/api"

interface EnhancedReportBrowserProps {
  currentPath: string;
  onPathChange: (path: string) => void;
  onReportSelect: (reportPath: string) => void;
  selectedReport?: string | null;
}

type ContextMenuType = 'folder' | 'report' | null;
type DialogType = 'createFolder' | 'moveItem' | 'security' | 'search' | null;

interface ContextMenuState {
  type: ContextMenuType;
  item: FolderItem | ReportItem | null;
  x: number;
  y: number;
}

export const EnhancedReportBrowser: React.FC<EnhancedReportBrowserProps> = ({
  currentPath,
  onPathChange,
  onReportSelect,
  selectedReport
}) => {
  const { folderData, isLoading, refetch } = useSSRSBrowser(currentPath)
  
  // State management
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedItem, setSelectedItem] = useState<FolderItem | ReportItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  
  // Form states
  const [createFolderForm, setCreateFolderForm] = useState({ folderName: "", description: "" })
  const [moveItemForm, setMoveItemForm] = useState({ targetPath: "" })
  const [policies, setPolicies] = useState<PolicyInfo[]>([])
  const [roles, setRoles] = useState<RoleInfo[]>([])
  const [isLoading_mgmt, setIsLoading_mgmt] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Search functionality
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      const results = await ssrsApi.searchReports(searchQuery)
      setSearchResults(results)
    } catch (err: any) {
      setSearchError(err.message)
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery])

  // Context menu handlers
  const handleContextMenu = useCallback((
    e: React.MouseEvent,
    type: ContextMenuType,
    item: FolderItem | ReportItem
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      type,
      item,
      x: e.clientX,
      y: e.clientY
    })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  // Dialog management
  const openDialog = useCallback((dialog: DialogType, item?: FolderItem | ReportItem) => {
    setActiveDialog(dialog)
    if (item) setSelectedItem(item)
    closeContextMenu()
  }, [closeContextMenu])

  const closeDialog = useCallback(() => {
    setActiveDialog(null)
    setSelectedItem(null)
    setCreateFolderForm({ folderName: "", description: "" })
    setMoveItemForm({ targetPath: "" })
    setPolicies([])
    setError(null)
    setSuccess(null)
  }, [])

  // CRUD operations
  const handleCreateFolder = async () => {
    if (!createFolderForm.folderName.trim()) return

    setIsLoading_mgmt(true)
    setError(null)

    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      const request: CreateFolderRequest = {
        parentPath: currentPath,
        folderName: createFolderForm.folderName,
        description: createFolderForm.description
      }
      await ssrsApi.createFolder(request)
      setSuccess("Folder created successfully")
      closeDialog()
      refetch()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading_mgmt(false)
    }
  }

  const handleDeleteItem = async (item: FolderItem | ReportItem, isFolder: boolean) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return

    setIsLoading_mgmt(true)
    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      if (isFolder) {
        await ssrsApi.deleteFolder(item.path)
      } else {
        await ssrsApi.deleteReport(item.path)
      }
      setSuccess(`${isFolder ? "Folder" : "Report"} deleted successfully`)
      refetch()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading_mgmt(false)
    }
    closeContextMenu()
  }

  const handleMoveItem = async () => {
    if (!selectedItem || !moveItemForm.targetPath.trim()) return

    setIsLoading_mgmt(true)
    setError(null)

    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      const request: MoveItemRequest = {
        itemPath: selectedItem.path,
        targetPath: moveItemForm.targetPath
      }
      await ssrsApi.moveItem(request)
      setSuccess("Item moved successfully")
      closeDialog()
      refetch()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading_mgmt(false)
    }
  }

  const loadSecurity = async (itemPath: string) => {
    setIsLoading_mgmt(true)
    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      const [policiesData, rolesData] = await Promise.all([
        ssrsApi.getPolicies(itemPath),
        ssrsApi.listRoles()
      ])
      setPolicies(policiesData)
      setRoles(rolesData)
    } catch (err: any) {
      setError("Failed to load security settings: " + err.message)
    } finally {
      setIsLoading_mgmt(false)
    }
  }

  const saveSecurity = async () => {
    if (!selectedItem) return

    setIsLoading_mgmt(true)
    try {
      const { ssrsApi } = await import("../services/ssrsApi")
      await ssrsApi.setPolicies(selectedItem.path, policies)
      setSuccess("Security settings saved successfully")
    } catch (err: any) {
      setError("Failed to save security settings: " + err.message)
    } finally {
      setIsLoading_mgmt(false)
    }
  }

  // Event handlers
  React.useEffect(() => {
    const handleClickOutside = () => closeContextMenu()
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [closeContextMenu])

  React.useEffect(() => {
    handleSearch()
  }, [searchQuery, handleSearch])

  const isInSearchMode = searchQuery.trim().length > 0

  return (
    <div className="professional-card" style={{ overflow: "hidden", padding: 0, position: "relative" }}>
      {/* Header with Search */}
      <div style={{ padding: "14px 14px 10px 14px", borderBottom: "1px solid #e0e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#1e293b",
            margin: 0,
            letterSpacing: "-0.01em",
          }}>
            {isInSearchMode ? `Search Results (${searchResults.length})` : "Browse Reports"}
          </h2>
          <button
            onClick={() => openDialog('createFolder')}
            style={{
              padding: "6px 12px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <Plus style={{ height: "14px", width: "14px" }} />
            New Folder
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative" }}>
          <Search style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            height: "16px",
            width: "16px",
            color: "#64748b"
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports and folders..."
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              backgroundColor: "#fff"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b"
              }}
            >
              <X style={{ height: "16px", width: "16px" }} />
            </button>
          )}
        </div>

        {/* Search Error */}
        {searchError && (
          <div style={{
            marginTop: "8px",
            padding: "8px 12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "4px",
            color: "#dc2626",
            fontSize: "12px"
          }}>
            {searchError}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "14px" }}>
        {/* Success/Error Messages */}
        {success && (
          <div style={{
            padding: "12px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "6px",
            color: "#16a34a",
            fontSize: "14px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            {success}
            <button onClick={() => setSuccess(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X style={{ height: "16px", width: "16px" }} />
            </button>
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
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            {error}
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X style={{ height: "16px", width: "16px" }} />
            </button>
          </div>
        )}

        {isLoading || isSearching ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "120px"
          }}>
            <div style={{
              width: "20px",
              height: "20px",
              border: "2px solid #e2e8f0",
              borderTop: "2px solid #64748b",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }} />
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            width: "100%"
          }}>
            {/* Search Results or Folder Contents */}
            {isInSearchMode ? (
              // Search Results
              searchResults.map((result) => {
                const isSelected = selectedReport === result.path && result.type === 'Report';
                return (
                  <div
                    key={result.path}
                    onClick={() => result.type === "Report" && onReportSelect(result.path)}
                    onContextMenu={(e) => handleContextMenu(e, result.type === 'Report' ? 'report' : 'folder', result as any)}
                    style={{
                      padding: "18px 18px 12px 18px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #e0e8f0",
                      background: isSelected ? "#e0e7ff" : "#fff",
                      boxShadow: isSelected ? "0 2px 6px rgba(37,99,235,0.08)" : "0 1px 2px rgba(0,0,0,0.02)",
                      minHeight: "90px",
                      position: "relative"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                      {result.type === 'Report' ? (
                        <File style={{
                          marginRight: "10px",
                          height: "18px",
                          width: "18px",
                          color: isSelected ? "#2563eb" : "#0ea5e9"
                        }} />
                      ) : (
                        <Folder style={{
                          marginRight: "10px",
                          height: "18px",
                          width: "18px",
                          color: "#64748b"
                        }} />
                      )}
                      <span style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: isSelected ? "#2563eb" : "#1e293b"
                      }}>
                        {result.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleContextMenu(e, result.type === 'Report' ? 'report' : 'folder', result as any)
                        }}
                        style={{
                          marginLeft: "auto",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "4px",
                          borderRadius: "4px"
                        }}
                      >
                        <MoreVertical style={{ height: "16px", width: "16px", color: "#64748b" }} />
                      </button>
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "12px",
                      color: "#64748b",
                      marginLeft: "28px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Calendar style={{ marginRight: "4px", height: "13px", width: "13px" }} />
                        {new Date(result.modifiedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      padding: "2px 6px",
                      fontSize: "10px",
                      backgroundColor: result.type === "Report" ? "#dbeafe" : "#f3f4f6",
                      color: result.type === "Report" ? "#1e40af" : "#374151",
                      borderRadius: "8px",
                      fontWeight: "500"
                    }}>
                      {result.type}
                    </div>
                  </div>
                );
              })
            ) : (
              // Folder Contents
              <>
                {folderData?.folders?.map((folder) => (
                  <div
                    key={folder.path}
                    onClick={() => onPathChange(folder.path)}
                    onContextMenu={(e) => handleContextMenu(e, 'folder', folder)}
                    style={{
                      padding: "18px 18px 12px 18px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: "1px solid #e0e8f0",
                      background: "#f8fafc",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                      minHeight: "90px",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f6fa"
                      e.currentTarget.style.borderColor = "#2563eb"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc"
                      e.currentTarget.style.borderColor = "#e0e8f0"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                      <Folder style={{
                        marginRight: "10px",
                        height: "18px",
                        width: "18px",
                        color: "#64748b"
                      }} />
                      <span style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#1e293b"
                      }}>
                        {folder.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleContextMenu(e, 'folder', folder)
                        }}
                        style={{
                          marginLeft: "auto",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "4px",
                          borderRadius: "4px"
                        }}
                      >
                        <MoreVertical style={{ height: "16px", width: "16px", color: "#64748b" }} />
                      </button>
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "12px",
                      color: "#64748b",
                      marginLeft: "28px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Calendar style={{ marginRight: "4px", height: "13px", width: "13px" }} />
                        {new Date(folder.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}

                {folderData?.reports?.map((report) => {
                  const isSelected = selectedReport === report.path;
                  return (
                    <div
                      key={report.path}
                      onClick={() => onReportSelect(report.path)}
                      onContextMenu={(e) => handleContextMenu(e, 'report', report)}
                      style={{
                        padding: "18px 18px 12px 18px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        border: isSelected ? "2px solid #2563eb" : "1px solid #e0e8f0",
                        background: isSelected ? "#e0e7ff" : "#fff",
                        boxShadow: isSelected ? "0 2px 6px rgba(37,99,235,0.08)" : "0 1px 2px rgba(0,0,0,0.02)",
                        minHeight: "90px",
                        position: "relative"
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "#f0f9ff"
                          e.currentTarget.style.borderColor = "#0ea5e9"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "#fff"
                          e.currentTarget.style.borderColor = "#e0e8f0"
                        }
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                        <File style={{
                          marginRight: "10px",
                          height: "18px",
                          width: "18px",
                          color: isSelected ? "#2563eb" : "#0ea5e9"
                        }} />
                        <span style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: isSelected ? "#2563eb" : "#1e293b"
                        }}>
                          {report.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleContextMenu(e, 'report', report)
                          }}
                          style={{
                            marginLeft: "auto",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px"
                          }}
                        >
                          <MoreVertical style={{ height: "16px", width: "16px", color: "#64748b" }} />
                        </button>
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "12px",
                        color: "#64748b",
                        marginLeft: "28px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Calendar style={{ marginRight: "4px", height: "13px", width: "13px" }} />
                          {new Date(report.modifiedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: "white",
            border: "1px solid #e0e3e7",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            minWidth: "150px"
          }}
        >
          <button
            onClick={() => openDialog('moveItem', contextMenu.item!)}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "none",
              background: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Move style={{ height: "16px", width: "16px" }} />
            Move
          </button>
          <button
            onClick={() => {
              openDialog('security', contextMenu.item!)
              loadSecurity(contextMenu.item!.path)
            }}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "none",
              background: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Shield style={{ height: "16px", width: "16px" }} />
            Security
          </button>
          <div style={{ height: "1px", backgroundColor: "#e0e3e7", margin: "4px 0" }} />
          <button
            onClick={() => handleDeleteItem(contextMenu.item!, contextMenu.type === 'folder')}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "none",
              background: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Trash2 style={{ height: "16px", width: "16px" }} />
            Delete
          </button>
        </div>
      )}

      {/* Dialogs */}
      {activeDialog === 'createFolder' && (
        <DialogOverlay onClose={closeDialog}>
          <DialogContent title="Create New Folder">
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500" }}>
                Folder Name *
              </label>
              <input
                type="text"
                value={createFolderForm.folderName}
                onChange={(e) => setCreateFolderForm({ ...createFolderForm, folderName: e.target.value })}
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
                value={createFolderForm.description}
                onChange={(e) => setCreateFolderForm({ ...createFolderForm, description: e.target.value })}
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
            <DialogActions>
              <button
                onClick={closeDialog}
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
                disabled={isLoading_mgmt || !createFolderForm.folderName.trim()}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isLoading_mgmt || !createFolderForm.folderName.trim() ? "not-allowed" : "pointer",
                  opacity: isLoading_mgmt || !createFolderForm.folderName.trim() ? 0.6 : 1
                }}
              >
                {isLoading_mgmt ? "Creating..." : "Create"}
              </button>
            </DialogActions>
          </DialogContent>
        </DialogOverlay>
      )}

      {activeDialog === 'moveItem' && selectedItem && (
        <DialogOverlay onClose={closeDialog}>
          <DialogContent title={`Move ${('type' in selectedItem && selectedItem.type === 'folder') || 'folders' in selectedItem ? 'Folder' : 'Report'}`}>
            <div style={{ marginBottom: "16px", fontSize: "14px", color: "#64748b" }}>
              Moving: <strong>{selectedItem.name}</strong>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500" }}>
                Target Path *
              </label>
              <input
                type="text"
                value={moveItemForm.targetPath}
                onChange={(e) => setMoveItemForm({ targetPath: e.target.value })}
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
            <DialogActions>
              <button
                onClick={closeDialog}
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
                disabled={isLoading_mgmt || !moveItemForm.targetPath.trim()}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isLoading_mgmt || !moveItemForm.targetPath.trim() ? "not-allowed" : "pointer",
                  opacity: isLoading_mgmt || !moveItemForm.targetPath.trim() ? 0.6 : 1
                }}
              >
                {isLoading_mgmt ? "Moving..." : "Move"}
              </button>
            </DialogActions>
          </DialogContent>
        </DialogOverlay>
      )}

      {activeDialog === 'security' && selectedItem && (
        <DialogOverlay onClose={closeDialog}>
          <DialogContent title={`Security Settings - ${selectedItem.name}`}>
            {isLoading_mgmt ? (
              <div style={{ textAlign: "center", padding: "20px" }}>Loading security settings...</div>
            ) : (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>Policies</h4>
                    <button
                      onClick={() => {
                        const newPolicy: PolicyInfo = { groupUserName: "", roles: [] }
                        setPolicies([...policies, newPolicy])
                      }}
                      style={{
                        padding: "4px 8px",
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

                  {policies.length === 0 ? (
                    <div style={{ color: "#64748b", fontSize: "14px", textAlign: "center", padding: "20px" }}>
                      No policies configured
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "12px", maxHeight: "300px", overflowY: "auto" }}>
                      {policies.map((policy, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "12px",
                            border: "1px solid #e0e3e7",
                            borderRadius: "6px",
                            backgroundColor: "#f8fafc"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                            <input
                              type="text"
                              value={policy.groupUserName}
                              onChange={(e) => {
                                const newPolicies = [...policies]
                                newPolicies[index].groupUserName = e.target.value
                                setPolicies(newPolicies)
                              }}
                              placeholder="User/Group name"
                              style={{
                                flex: 1,
                                padding: "6px 8px",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                fontSize: "14px",
                                marginRight: "8px"
                              }}
                            />
                            <button
                              onClick={() => setPolicies(policies.filter((_, i) => i !== index))}
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
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "500" }}>
                              Roles:
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                              {roles.map((role) => (
                                <label key={role.name} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                                  <input
                                    type="checkbox"
                                    checked={policy.roles.includes(role.name)}
                                    onChange={(e) => {
                                      const newPolicies = [...policies]
                                      if (e.target.checked) {
                                        newPolicies[index].roles = [...new Set([...policy.roles, role.name])]
                                      } else {
                                        newPolicies[index].roles = policy.roles.filter(r => r !== role.name)
                                      }
                                      setPolicies(newPolicies)
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

                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Available Roles</h4>
                  <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {roles.map((role) => (
                      <div
                        key={role.name}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #e0e3e7",
                          borderRadius: "4px",
                          backgroundColor: "#fff",
                          marginBottom: "4px"
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: "500" }}>{role.name}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{role.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <DialogActions>
              <button
                onClick={closeDialog}
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
                onClick={saveSecurity}
                disabled={isLoading_mgmt}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isLoading_mgmt ? "not-allowed" : "pointer",
                  opacity: isLoading_mgmt ? 0.6 : 1
                }}
              >
                {isLoading_mgmt ? "Saving..." : "Save"}
              </button>
            </DialogActions>
          </DialogContent>
        </DialogOverlay>
      )}
    </div>
  )
}

// Helper Components
const DialogOverlay: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => (
  <div
    style={{
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
    }}
    onClick={onClose}
  >
    <div onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
)

const DialogContent: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
  <div
    style={{
      backgroundColor: "white",
      padding: "24px",
      borderRadius: "8px",
      width: "500px",
      maxWidth: "90vw",
      maxHeight: "80vh",
      overflowY: "auto"
    }}
  >
    <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "18px", fontWeight: "600" }}>
      {title}
    </h3>
    {children}
  </div>
)

const DialogActions: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "20px" }}>
    {children}
  </div>
)