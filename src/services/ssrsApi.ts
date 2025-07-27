import type {
  TestConnectionResponse,
  BrowseResponse,
  ReportParameter,
  RenderRequest,
  UserInfo,
  RenderFormat,
  ReportItem,
  SearchResult,
  PolicyInfo,
  RoleInfo,
  CreateFolderRequest,
  CreateReportRequest,
  MoveItemRequest
} from '../types/api';

class SSRSApiService {
  private baseUrl: string;
  private reportsBaseUrl: string;
  private managementBaseUrl: string;
  private securityBaseUrl: string;

  constructor() {
    // Base API URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7134/api';
    this.baseUrl = apiBaseUrl;
    this.reportsBaseUrl = `${this.baseUrl}/Reports`;
    this.managementBaseUrl = `${this.baseUrl}/Management`;
    this.securityBaseUrl = `${this.baseUrl}/Security`;
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response as unknown as T;
  }

  // ===========================================
  // REPORTS CONTROLLER METHODS
  // ===========================================

  /**
   * Test SSRS connectivity and get basic server information
   */
  async testConnection(): Promise<TestConnectionResponse> {
    return this.request<TestConnectionResponse>(`${this.reportsBaseUrl}/test-connection`);
  }

  /**
   * Browse SSRS folder structure
   */
  async browseFolder(folderPath: string = '/'): Promise<BrowseResponse> {
    const url = `${this.reportsBaseUrl}/browse?folderPath=${encodeURIComponent(folderPath)}`;
    return this.request<BrowseResponse>(url);
  }

  /**
   * Get reports from a folder (legacy endpoint)
   */
  async getReports(folderPath: string = '/'): Promise<ReportItem[]> {
    const url = `${this.reportsBaseUrl}?folderPath=${encodeURIComponent(folderPath)}`;
    return this.request<ReportItem[]>(url);
  }

  /**
   * Get parameter definitions for a specific report
   */
  async getReportParameters(reportPath: string): Promise<ReportParameter[]> {
    const url = `${this.reportsBaseUrl}/parameters?reportPath=${encodeURIComponent(reportPath)}`;
    return this.request<ReportParameter[]>(url);
  }

  /**
   * Render report in specified format
   */
  async renderReport(request: RenderRequest, format: RenderFormat = 'PDF'): Promise<Blob> {
    const endpoint = format.toUpperCase() === 'PDF' ? '/render' : `/render/${format}`;
    const response = await fetch(`${this.reportsBaseUrl}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.blob();
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<UserInfo> {
    return this.request<UserInfo>(`${this.reportsBaseUrl}/user`);
  }

  /**
   * Search for reports and folders by name or description
   */
  async searchReports(query: string): Promise<SearchResult[]> {
    const url = `${this.reportsBaseUrl}/search?query=${encodeURIComponent(query)}`;
    return this.request<SearchResult[]>(url);
  }

  // ===========================================
  // MANAGEMENT CONTROLLER METHODS
  // ===========================================

  /**
   * Create a new folder in SSRS
   */
  async createFolder(request: CreateFolderRequest): Promise<{ message: string }> {
    const url = `${this.managementBaseUrl}/folder?parentPath=${encodeURIComponent(request.parentPath)}&folderName=${encodeURIComponent(request.folderName)}&description=${encodeURIComponent(request.description || '')}`;
    return this.request<{ message: string }>(url, {
      method: 'POST',
    });
  }

  /**
   * Delete a folder from SSRS
   */
  async deleteFolder(folderPath: string): Promise<{ message: string }> {
    const url = `${this.managementBaseUrl}/folder?folderPath=${encodeURIComponent(folderPath)}`;
    return this.request<{ message: string }>(url, {
      method: 'DELETE',
    });
  }

  /**
   * Create a new report in SSRS
   */
  async createReport(request: CreateReportRequest): Promise<{ message: string }> {
    const url = `${this.managementBaseUrl}/report?parentPath=${encodeURIComponent(request.parentPath)}&reportName=${encodeURIComponent(request.reportName)}&description=${encodeURIComponent(request.description || '')}`;
    return this.request<{ message: string }>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.definition),
    });
  }

  /**
   * Delete a report from SSRS
   */
  async deleteReport(reportPath: string): Promise<{ message: string }> {
    const url = `${this.managementBaseUrl}/report?reportPath=${encodeURIComponent(reportPath)}`;
    return this.request<{ message: string }>(url, {
      method: 'DELETE',
    });
  }

  /**
   * Move an item (report or folder) to a new location
   */
  async moveItem(request: MoveItemRequest): Promise<{ message: string }> {
    const url = `${this.managementBaseUrl}/move?itemPath=${encodeURIComponent(request.itemPath)}&targetPath=${encodeURIComponent(request.targetPath)}`;
    return this.request<{ message: string }>(url, {
      method: 'POST',
    });
  }

  // ===========================================
  // SECURITY CONTROLLER METHODS
  // ===========================================

  /**
   * Get policies for an item
   */
  async getPolicies(itemPath: string): Promise<PolicyInfo[]> {
    const url = `${this.securityBaseUrl}/policies?itemPath=${encodeURIComponent(itemPath)}`;
    return this.request<PolicyInfo[]>(url);
  }

  /**
   * Set policies for an item
   */
  async setPolicies(itemPath: string, policies: PolicyInfo[]): Promise<{ message: string }> {
    const url = `${this.securityBaseUrl}/policies?itemPath=${encodeURIComponent(itemPath)}`;
    return this.request<{ message: string }>(url, {
      method: 'POST',
      body: JSON.stringify(policies),
    });
  }

  /**
   * List all available SSRS catalog roles (item-level roles)
   * Replaces the legacy listRoles() method
   */
  async listCatalogRoles(): Promise<RoleInfo[]> {
    return this.request<RoleInfo[]>(`${this.securityBaseUrl}/roles/catalog`);
  }

  /**
   * List all available SSRS system roles (system-level roles)
   */
  async listSystemRoles(): Promise<RoleInfo[]> {
    return this.request<RoleInfo[]>(`${this.securityBaseUrl}/roles/system`);
  }

  /**
   * List all available SSRS roles (legacy endpoint - uses catalog roles)
   * @deprecated Use listCatalogRoles() instead for catalog roles or listSystemRoles() for system roles
   */
  async listRoles(): Promise<RoleInfo[]> {
    return this.request<RoleInfo[]>(`${this.securityBaseUrl}/roles`);
  }

  /**
   * Get all items where a user or group has permissions
   */
  async getUserGroupPolicies(userOrGroup: string): Promise<Array<{
    itemPath: string;
    itemType: string;
    roles: string[];
  }>> {
    const url = `${this.securityBaseUrl}/policies/user?userOrGroup=${encodeURIComponent(userOrGroup)}`;
    return this.request<Array<{
      itemPath: string;
      itemType: string;
      roles: string[];
    }>>(url);
  }

  /**
   * Get global (system-level) security policies.
   */
  async getSystemPolicies(): Promise<PolicyInfo[]> {
    return this.request<PolicyInfo[]>(`${this.securityBaseUrl}/system-policies`);
  }

  /**
   * Set global (system-level) security policies. This will overwrite all existing system policies.
   */
  async setSystemPolicies(policies: PolicyInfo[]): Promise<{ message: string }> {
    return this.request<{ message: string }>(`${this.securityBaseUrl}/system-policies`, {
      method: 'POST',
      body: JSON.stringify(policies),
    });
  }

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Download a rendered report
   */
  async downloadReport(
    reportPath: string, 
    parameters: Record<string, any> = {},
    format: RenderFormat = 'PDF',
    filename?: string
  ): Promise<void> {
    try {
      const blob = await this.renderReport({ reportPath, parameters }, format);
      
      // Generate filename if not provided
      if (!filename) {
        const reportName = reportPath.split('/').pop() || 'report';
        const extension = this.getFileExtension(format);
        filename = `${reportName}_${new Date().toISOString().split('T')[0]}.${extension}`;
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  /**
   * Get file extension for the specified format
   */
  private getFileExtension(format: RenderFormat): string {
    const extensions: Record<RenderFormat, string> = {
      PDF: 'pdf',
      EXCEL: 'xlsx',
      WORD: 'docx',
      CSV: 'csv',
      XML: 'xml',
      IMAGE: 'png'
    };
    return extensions[format];
  }

  /**
   * Get MIME type for the specified format
   */
  getMimeType(format: RenderFormat): string {
    const mimeTypes: Record<RenderFormat, string> = {
      PDF: 'application/pdf',
      EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      WORD: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      CSV: 'text/csv',
      XML: 'application/xml',
      IMAGE: 'image/png'
    };
    return mimeTypes[format];
  }

  // ===========================================
  // CONVENIENCE METHODS
  // ===========================================

  /**
   * Get full folder hierarchy from root
   */
  async getFolderHierarchy(): Promise<BrowseResponse> {
    return this.browseFolder('/');
  }

  /**
   * Check if user has access to a specific report
   */
  async hasReportAccess(reportPath: string): Promise<boolean> {
    try {
      await this.getReportParameters(reportPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all reports recursively from a folder
   */
  async getAllReportsRecursive(folderPath: string = '/'): Promise<ReportItem[]> {
    const allReports: ReportItem[] = [];
    
    const processFolder = async (path: string) => {
      const content = await this.browseFolder(path);
      allReports.push(...content.reports);
      
      // Process subfolders recursively
      for (const folder of content.folders) {
        await processFolder(folder.path);
      }
    };
    
    await processFolder(folderPath);
    return allReports;
  }

  /**
   * Preview report parameters without rendering
   */
  async previewReportParameters(reportPath: string): Promise<{
    parameters: ReportParameter[];
    hasRequiredParameters: boolean;
    requiredParameters: string[];
  }> {
    const parameters = await this.getReportParameters(reportPath);
    const requiredParameters = parameters
      .filter(p => !p.nullable && !p.allowBlank && !p.defaultValue)
      .map(p => p.name);
    
    return {
      parameters,
      hasRequiredParameters: requiredParameters.length > 0,
      requiredParameters
    };
  }

  /**
   * Bulk delete items (reports and folders)
   */
  async bulkDeleteItems(itemPaths: string[]): Promise<{
    successful: string[];
    failed: Array<{ path: string; error: string }>;
  }> {
    const successful: string[] = [];
    const failed: Array<{ path: string; error: string }> = [];

    for (const itemPath of itemPaths) {
      try {
        // Try to determine if it's a report or folder by checking the browse response
        // If it fails, assume it's a report
        try {
          await this.browseFolder(itemPath);
          await this.deleteFolder(itemPath);
        } catch {
          await this.deleteReport(itemPath);
        }
        successful.push(itemPath);
      } catch (error) {
        failed.push({
          path: itemPath,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { successful, failed };
  }

  // ===========================================
  // ENHANCED SECURITY METHODS
  // ===========================================

  /**
   * Get all available roles (both system and catalog roles)
   */
  async getAllRoles(): Promise<{
    systemRoles: RoleInfo[];
    catalogRoles: RoleInfo[];
  }> {
    const [systemRoles, catalogRoles] = await Promise.all([
      this.listSystemRoles(),
      this.listCatalogRoles()
    ]);

    return {
      systemRoles,
      catalogRoles
    };
  }

  /**
   * Check if a role is a system role or catalog role
   */
  async getRoleType(roleName: string): Promise<'system' | 'catalog' | 'unknown'> {
    try {
      const { systemRoles, catalogRoles } = await this.getAllRoles();
      
      if (systemRoles.some(role => role.name === roleName)) {
        return 'system';
      }
      
      if (catalogRoles.some(role => role.name === roleName)) {
        return 'catalog';
      }
      
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get role information by name
   */
  async getRoleInfo(roleName: string): Promise<RoleInfo | null> {
    try {
      const { systemRoles, catalogRoles } = await this.getAllRoles();
      const allRoles = [...systemRoles, ...catalogRoles];
      
      return allRoles.find(role => role.name === roleName) || null;
    } catch {
      return null;
    }
  }

  /**
   * Validate if roles exist and are appropriate for the context
   */
  async validateRoles(roles: string[], context: 'system' | 'catalog' = 'catalog'): Promise<{
    valid: string[];
    invalid: string[];
    warnings: string[];
  }> {
    try {
      const { systemRoles, catalogRoles } = await this.getAllRoles();
      const validRoles = context === 'system' ? systemRoles : catalogRoles;
      const otherRoles = context === 'system' ? catalogRoles : systemRoles;
      
      const valid: string[] = [];
      const invalid: string[] = [];
      const warnings: string[] = [];

      for (const roleName of roles) {
        if (validRoles.some(role => role.name === roleName)) {
          valid.push(roleName);
        } else if (otherRoles.some(role => role.name === roleName)) {
          warnings.push(`Role '${roleName}' is a ${context === 'system' ? 'catalog' : 'system'} role, not appropriate for ${context} context`);
          invalid.push(roleName);
        } else {
          invalid.push(roleName);
        }
      }

      return { valid, invalid, warnings };
    } catch {
      return { valid: [], invalid: roles, warnings: ['Unable to validate roles due to API error'] };
    }
  }
}

export const ssrsApi = new SSRSApiService();
export default SSRSApiService;