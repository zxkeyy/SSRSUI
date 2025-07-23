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
