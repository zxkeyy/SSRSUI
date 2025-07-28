import { useState, useEffect, useCallback } from 'react'
import type {
  BrowseResponse,
  ReportParameter,
  RenderFormat,
  UserInfo,
  TestConnectionResponse
} from '../types/api'

// Enhanced hook with refetch capability
export const useSSRSBrowser = (folderPath: string) => {
  const [folderData, setFolderData] = useState<BrowseResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { ssrsApi } = await import('../services/ssrsApi')
      const data = await ssrsApi.browseFolder(folderPath)
      setFolderData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load folder contents')
      setFolderData(null)
    } finally {
      setIsLoading(false)
    }
  }, [folderPath])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    folderData,
    isLoading,
    error,
    refetch: fetchData
  }
}

export const useReportParameters = (reportPath: string | null) => {
  const [parameters, setParameters] = useState<ReportParameter[]>([])
  const [parameterValues, setParameterValues] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reportPath) {
      setParameters([])
      setParameterValues({})
      setIsReady(false)
      return
    }
    setIsReady(false)

    const fetchParameters = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const { ssrsApi } = await import('../services/ssrsApi')
        const params = await ssrsApi.getReportParameters(reportPath)
        setParameters(params)
        setIsReady(true)
        
        // Initialize parameter values with defaults
        const initialValues: Record<string, any> = {}
        params.forEach(param => {
          if (param.defaultValue !== undefined) {
            initialValues[param.name] = param.defaultValue
          }
        })
        setParameterValues(initialValues)
      } catch (err: any) {
        setError(err.message || 'Failed to load report parameters')
        setParameters([])
        setParameterValues({})
      } finally {
        setIsLoading(false)
      }
    }

    fetchParameters()
  }, [reportPath])

  const updateParameterValue = useCallback((name: string, value: any) => {
    setParameterValues(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const resetParameters = useCallback(() => {
    const initialValues: Record<string, any> = {}
    parameters.forEach(param => {
      if (param.defaultValue !== undefined) {
        initialValues[param.name] = param.defaultValue
      }
    })
    setParameterValues(initialValues)
  }, [parameters])

  return {
    parameters,
    parameterValues,
    isLoading,
    isReady,
    error,
    updateParameterValue,
    resetParameters
  }
}

export const useReportRenderer = () => {
  const [isRendering, setIsRendering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const renderReport = useCallback(async (
    reportPath: string,
    parameters: Record<string, any> = {},
    format: RenderFormat = 'PDF'
  ): Promise<Blob | null> => {
    setIsRendering(true)
    setError(null)

    try {
      const { ssrsApi } = await import('../services/ssrsApi')
      const blob = await ssrsApi.renderReport({ reportPath, parameters }, format)
      return blob
    } catch (err: any) {
      setError(err.message || 'Failed to render report')
      return null
    } finally {
      setIsRendering(false)
    }
  }, [])

  const downloadReport = useCallback(async (
    reportPath: string,
    parameters: Record<string, any> = {},
    format: RenderFormat = 'PDF',
    filename?: string
  ) => {
    setIsRendering(true)
    setError(null)

    try {
      const { ssrsApi } = await import('../services/ssrsApi')
      await ssrsApi.downloadReport(reportPath, parameters, format, filename)
    } catch (err: any) {
      setError(err.message || 'Failed to download report')
    } finally {
      setIsRendering(false)
    }
  }, [])

  return {
    renderReport,
    downloadReport,
    isRendering,
    error
  }
}

export const useSSRSConnection = () => {
  const [connectionInfo, setConnectionInfo] = useState<TestConnectionResponse | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const { ssrsApi } = await import('../services/ssrsApi')
      const [connInfo, user] = await Promise.all([
        ssrsApi.testConnection(),
        ssrsApi.getCurrentUser()
      ])
      setConnectionInfo(connInfo)
      setUserInfo(user)
    } catch (err: any) {
      setError(err.message || 'Failed to connect to SSRS')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  useEffect(() => {
    testConnection()
  }, [testConnection])

  return {
    connectionInfo,
    userInfo,
    isConnecting,
    error,
    testConnection
  }
}