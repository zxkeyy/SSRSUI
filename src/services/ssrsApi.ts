import type {
  TestConnectionResponse,
  BrowseResponse,
  ReportParameter,
  RenderRequest,
  UserInfo,
  RenderFormat
} from '../types/api';

class SSRSApiService {
  private baseUrl: string;

  constructor() {
    // Always use direct API calls with CORS for Windows Authentication
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7134/api/Reports';
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
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

  /**
   * Test SSRS connectivity and get basic server information
   */
  async testConnection(): Promise<TestConnectionResponse> {
    return this.request<TestConnectionResponse>('/test-connection');
  }

  /**
   * Browse SSRS folder structure
   */
  async browseFolder(folderPath: string = '/'): Promise<BrowseResponse> {
    const url = `/browse?folderPath=${encodeURIComponent(folderPath)}`;
    return this.request<BrowseResponse>(url);
  }

  /**
   * Get reports from a folder (legacy endpoint)
   */


  /**
   * Get parameter definitions for a specific report
   */
  async getReportParameters(reportPath: string): Promise<ReportParameter[]> {
    const url = `/parameters?reportPath=${encodeURIComponent(reportPath)}`;
    return this.request<ReportParameter[]>(url);
  }

  /**
   * Render report as PDF
   */


  /**
   * Render report in specified format
   */
  async renderReport(request: RenderRequest, format: RenderFormat): Promise<Blob> {
    const endpoint = format.toUpperCase() === 'PDF' ? '/render' : `/render/${format}`;
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
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
    return this.request<UserInfo>('/user');
  }

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
}

export const ssrsApi = new SSRSApiService();
export default SSRSApiService;
