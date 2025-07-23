import { useState, useEffect, useCallback } from 'react';
import { ssrsApi } from '../services/ssrsApi';
import type {
  TestConnectionResponse,
  BrowseResponse,
  ReportParameter,
  UserInfo,
  RenderFormat
} from '../types/api';

/**
 * Hook for managing SSRS connection status
 */
export function useSSRSConnection() {
  const [connectionStatus, setConnectionStatus] = useState<TestConnectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await ssrsApi.testConnection();
      setConnectionStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    testConnection();
  }, [testConnection]);

  return {
    connectionStatus,
    isLoading,
    error,
    testConnection
  };
}

/**
 * Hook for browsing SSRS folders and reports
 */
export function useSSRSBrowser(currentPath: string) {
  const [folderData, setFolderData] = useState<BrowseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const browseFolder = useCallback(async (folderPath: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ssrsApi.browseFolder(folderPath);
      setFolderData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to browse folder');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentPath) {
      browseFolder(currentPath);
    }
  }, [currentPath, browseFolder]);

  return {
    folderData,
    isLoading,
    error,
    refreshFolder: () => browseFolder(currentPath)
  };
}

/**
 * Hook for managing report parameters
 */
export function useReportParameters(reportPath: string | null) {
  const [parameters, setParameters] = useState<ReportParameter[]>([]);
  const [parameterValues, setParameterValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadParameters = useCallback(async (path: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = await ssrsApi.getReportParameters(path);
      setParameters(params);
      
      // Initialize parameter values with defaults
      const defaultValues: Record<string, any> = {};
      params.forEach(param => {
        if (param.defaultValue !== undefined) {
          defaultValues[param.name] = param.defaultValue;
        }
      });
      setParameterValues(defaultValues);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load parameters');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateParameterValue = useCallback((name: string, value: any) => {
    setParameterValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const resetParameters = useCallback(() => {
    const defaultValues: Record<string, any> = {};
    parameters.forEach(param => {
      if (param.defaultValue !== undefined) {
        defaultValues[param.name] = param.defaultValue;
      }
    });
    setParameterValues(defaultValues);
  }, [parameters]);

  useEffect(() => {
    if (reportPath) {
      loadParameters(reportPath);
    } else {
      setParameters([]);
      setParameterValues({});
    }
  }, [reportPath, loadParameters]);

  return {
    parameters,
    parameterValues,
    isLoading,
    error,
    updateParameterValue,
    resetParameters
  };
}

/**
 * Hook for rendering and downloading reports
 */
export function useReportRenderer() {
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderReport = useCallback(async (
    reportPath: string,
    parameters: Record<string, any> = {},
    format: RenderFormat = 'PDF'
  ): Promise<Blob | null> => {
    setIsRendering(true);
    setError(null);
    
    try {
      const blob = await ssrsApi.renderReport({ reportPath, parameters }, format);
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render report');
      return null;
    } finally {
      setIsRendering(false);
    }
  }, []);

  const downloadReport = useCallback(async (
    reportPath: string,
    parameters: Record<string, any> = {},
    format: RenderFormat = 'PDF',
    filename?: string
  ) => {
    setIsRendering(true);
    setError(null);
    
    try {
      await ssrsApi.downloadReport(reportPath, parameters, format, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download report');
    } finally {
      setIsRendering(false);
    }
  }, []);

  return {
    isRendering,
    error,
    renderReport,
    downloadReport
  };
}

/**
 * Hook for user information
 */
export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const info = await ssrsApi.getCurrentUser();
      setUserInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user information');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  return {
    userInfo,
    isLoading,
    error,
    refreshUserInfo: loadUserInfo
  };
}
