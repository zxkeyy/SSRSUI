"use client"

import React, { useState } from "react"
import { Folder, FolderOpen, Home, ChevronDown, ChevronRight, Dot } from "lucide-react"
import { useSSRSBrowser } from "../hooks/useSSRS"

interface SidebarNavigationProps {
  selectedPath: string
  onPathChange: (path: string) => void
}

// Recursive folder tree item
const FolderTreeItem: React.FC<{
  name: string;
  path: string;
  selectedPath: string;
  onPathChange: (path: string) => void;
  level?: number;
}> = ({ name, path, selectedPath, onPathChange, level = 0 }) => {
  const [expanded, setExpanded] = useState(path === "/");
  const { folderData } = useSSRSBrowser(path);
  const isSelected = selectedPath === path;
  const hasChildren = (folderData?.folders?.length ?? 0) > 0;

  return (
    <div>
      <div
        style={{
          cursor: "pointer",
          padding: "6px 8px",
          borderRadius: "4px",
          transition: "all 0.2s ease",
          backgroundColor: isSelected ? "#e8f0fe" : "transparent",
          border: isSelected ? "1.5px solid #2563eb" : "1px solid transparent",
          color: isSelected ? "#2563eb" : "#334155",
          fontWeight: isSelected ? 600 : 400,
          marginBottom: "1px",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          marginLeft: `${level * 12}px`,
        }}
        onClick={() => onPathChange(path)}
        onDoubleClick={() => hasChildren && setExpanded((v) => !v)}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "#f3f6fa"
            e.currentTarget.style.color = "#334155"
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "transparent"
            e.currentTarget.style.color = "#334155"
          }
        }}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown style={{ marginRight: 4, height: 14, width: 14, color: "#64748b" }} onClick={e => { e.stopPropagation(); setExpanded(false); }} />
          ) : (
            <ChevronRight style={{ marginRight: 4, height: 14, width: 14, color: "#64748b" }} onClick={e => { e.stopPropagation(); setExpanded(true); }} />
          )
        ) : (
          <Dot style={{ marginRight: 4, height: 14, width: 14, color: "#64748b" }} />
        )}
        {path === "/" ? (
          <Home style={{ marginRight: 6, height: 14, width: 14, color: "#64748b" }} />
        ) : (
          <Folder style={{ marginRight: 6, height: 14, width: 14, color: "#94a3b8" }} />
        )}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
      </div>
      {expanded && hasChildren && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          {folderData?.folders?.map((sub) => (
            <FolderTreeItem
              key={sub.path}
              name={sub.name}
              path={sub.path}
              selectedPath={selectedPath}
              onPathChange={onPathChange}
              level={(level || 0) + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ selectedPath, onPathChange }) => {
  return (
    <div
      className="professional-card"
      style={{
        overflow: "hidden",
        border: "none",
        boxShadow: "none",
        background: "transparent",
        padding: 0,
        transition: "all 0.2s ease",
        width: "100%",
        overflowY: "auto",
      }}
    >
      <div style={{ padding: "12px 6px 6px 6px" }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: "6px",
            display: "flex",
            alignItems: "center",
            letterSpacing: "-0.01em",
          }}
        >
          <FolderOpen style={{ marginRight: "6px", height: "16px", width: "16px", color: "#64748b" }} />
          Report Folders
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <FolderTreeItem
            name="Root"
            path="/"
            selectedPath={selectedPath}
            onPathChange={onPathChange}
          />
        </div>
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="padding: 12px 6px 6px 6px"] {
              padding: 8px 4px 4px 4px;
            }
            h3[style*="font-size: 14px"] {
              font-size: 13px;
            }
            div[style*="height: 16px"] {
              height: 14px;
              width: 14px;
            }
            div[style*="padding: 6px 8px"] {
              padding: 4px 6px;
              font-size: 11px;
            }
            div[style*="height: 14px"] {
              height: 12px;
              width: 12px;
            }
            div[style*="margin-left"] {
              margin-left: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};