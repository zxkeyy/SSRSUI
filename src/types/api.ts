// API Types based on SSRS Proxy API documentation

export interface ApiError {
  message: string;
  errorCode: string;
  user: string;
  reportPath?: string;
  timestamp: string;
}

export interface TestConnectionResponse {
  message: string;
  user: string;
  reportCount: number;
  folderCount: number;
  reports: ReportSummary[];
  timestamp: string;
}

export interface ReportSummary {
  name: string;
  path: string;
}

export interface ReportItem {
  name: string;
  path: string;
  type: string;
  createdDate: string;
  modifiedDate: string;
  description?: string;
}

export interface FolderItem {
  name: string;
  path: string;
  createdDate: string;
  modifiedDate: string;
  description?: string;
}

export interface BrowseResponse {
  currentPath: string;
  folders: FolderItem[];
  reports: ReportItem[];
}

export interface ReportParameter {
  name: string;
  type: 'String' | 'Integer' | 'Float' | 'DateTime' | 'Boolean';
  nullable: boolean;
  allowBlank: boolean;
  multiValue: boolean;
  validValues: string[];
  defaultValue?: string;
  prompt: string;
}

export interface RenderRequest {
  reportPath: string;
  parameters?: Record<string, any>;
}

export interface UserInfo {
  isAuthenticated: boolean;
  name: string;
  authenticationType: string;
  isWindowsIdentity: boolean;
}

export type RenderFormat = 'PDF' | 'EXCEL' | 'WORD' | 'CSV' | 'XML' | 'IMAGE';

export interface ParameterValue {
  [key: string]: string | number | boolean | Date | string[] | undefined;
}

// ===========================================
// SEARCH TYPES
// ===========================================

export interface SearchResult {
  type: 'Report' | 'Folder';
  name: string;
  path: string;
  description?: string;
  createdDate: string;
  modifiedDate: string;
}

// ===========================================
// MANAGEMENT TYPES
// ===========================================

export interface CreateFolderRequest {
  parentPath: string;
  folderName: string;
  description?: string;
}

export interface CreateReportRequest {
  parentPath: string;
  reportName: string;
  definition: number[]; // byte array
  description?: string;
}

export interface MoveItemRequest {
  itemPath: string;
  targetPath: string;
}

export interface ManagementResponse {
  message: string;
}

// ===========================================
// SECURITY TYPES
// ===========================================

export interface PolicyInfo {
  groupUserName: string;
  roles: string[];
}

export interface RoleInfo {
  name: string;
  description: string;
}

export interface UserGroupPolicyItem {
  itemPath: string;
  itemType: 'Report' | 'Folder';
  roles: string[];
}

// ===========================================
// COMMON RESPONSE TYPES
// ===========================================

export interface SuccessResponse {
  message: string;
}

export interface BulkOperationResult<T> {
  successful: T[];
  failed: Array<{
    item: T;
    error: string;
  }>;
}

// ===========================================
// ENHANCED REQUEST TYPES
// ===========================================

export interface AdvancedRenderRequest extends RenderRequest {
  format?: RenderFormat;
  deviceInfo?: Record<string, string>;
  timeout?: number;
}

export interface BulkRenderRequest {
  reports: Array<{
    reportPath: string;
    parameters?: Record<string, any>;
    format?: RenderFormat;
    filename?: string;
  }>;
}

// ===========================================
// PARAMETER VALIDATION TYPES
// ===========================================

export interface ParameterValidationResult {
  isValid: boolean;
  errors: Array<{
    parameterName: string;
    error: string;
  }>;
  warnings: Array<{
    parameterName: string;
    warning: string;
  }>;
}

export interface ValidatedParameter {
  name: string;
  value: any;
  isValid: boolean;
  error?: string;
  warning?: string;
}

// ===========================================
// FOLDER HIERARCHY TYPES
// ===========================================

export interface FolderTreeNode {
  item: FolderItem;
  children: FolderTreeNode[];
  reports: ReportItem[];
  expanded?: boolean;
  loading?: boolean;
}

export interface NavigationPath {
  segments: Array<{
    name: string;
    path: string;
  }>;
  currentFolder: string;
}

// ===========================================
// PERMISSION AND SECURITY TYPES
// ===========================================

export interface SecurityContext {
  user: UserInfo;
  permissions: Array<{
    itemPath: string;
    itemType: 'Report' | 'Folder';
    roles: string[];
    canView: boolean;
    canModify: boolean;
    canDelete: boolean;
  }>;
}

export interface RolePermission {
  role: string;
  permissions: string[];
  description: string;
}

// ===========================================
// REPORT EXECUTION TYPES
// ===========================================

export interface ReportExecutionInfo {
  executionId: string;
  reportPath: string;
  parameters: Record<string, any>;
  status: 'Running' | 'Completed' | 'Failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  error?: string;
}

export interface ReportPreview {
  reportPath: string;
  parameters: ReportParameter[];
  metadata: {
    size: string;
    lastModified: string;
    description?: string;
    dataSourceCount: number;
  };
}

// ===========================================
// FILE HANDLING TYPES
// ===========================================

export interface DownloadOptions {
  filename?: string;
  format: RenderFormat;
  openInNewTab?: boolean;
  showProgress?: boolean;
}

export interface FileUploadResult {
  success: boolean;
  filename: string;
  size: number;
  error?: string;
}

// ===========================================
// CACHE AND PERFORMANCE TYPES
// ===========================================

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string;
  skipCache?: boolean;
  refreshCache?: boolean;
}

export interface PerformanceMetrics {
  requestStart: number;
  requestEnd: number;
  duration: number;
  cacheHit: boolean;
  responseSize: number;
}

// ===========================================
// FILTER AND SORT TYPES
// ===========================================

export interface FilterOptions {
  name?: string;
  type?: 'Report' | 'Folder';
  dateRange?: {
    start: string;
    end: string;
  };
  hasParameters?: boolean;
  tags?: string[];
}

export interface SortOptions {
  field: 'name' | 'createdDate' | 'modifiedDate' | 'type';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
  totalCount?: number;
}

// ===========================================
// BATCH OPERATIONS TYPES
// ===========================================

export interface BatchOperation<T, R> {
  items: T[];
  operation: (item: T) => Promise<R>;
  concurrency?: number;
  onProgress?: (completed: number, total: number) => void;
  onError?: (item: T, error: Error) => void;
}

export interface BatchResult<T, R> {
  successful: Array<{ item: T; result: R }>;
  failed: Array<{ item: T; error: string }>;
  totalProcessed: number;
  duration: number;
}

// ===========================================
// EXPORT/IMPORT TYPES
// ===========================================

export interface ExportOptions {
  includeReports: boolean;
  includeFolders: boolean;
  includePermissions: boolean;
  format: 'json' | 'xml' | 'csv';
  compression?: boolean;
}

export interface ImportOptions {
  overwriteExisting: boolean;
  preservePermissions: boolean;
  createMissingFolders: boolean;
  validateReports: boolean;
}

// ===========================================
// UTILITY TYPES
// ===========================================

export type ItemType = 'Report' | 'Folder';

export type OperationStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

// ===========================================
// CONFIGURATION TYPES
// ===========================================

export interface ApiConfiguration {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  enableCache: boolean;
  enableLogging: boolean;
  logLevel: LogLevel;
}

export interface SSRSEnvironment {
  name: string;
  baseUrl: string;
  description?: string;
  isDefault: boolean;
  isProduction: boolean;
}