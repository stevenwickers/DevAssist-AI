import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'

import { getApiStatus } from '@/features/ai/api-status.ts'
import {
  DataSourceContext,
  type DataSource,
  type DataSourceContextValue,
} from './data-source-context.ts'

const STORAGE_KEY = 'devassist-ai-data-source'
const MISSING_KEY_TOAST_ID = 'openai-api-key-missing'
const MISSING_KEY_MESSAGE =
  'OPENAI_API_KEY is not set. This app can only run in MOCK mode until the OPENAI_API_KEY is set.'

function getInitialDataSource(): DataSource {
  if (typeof window === 'undefined') {
    return 'mock'
  }

  return window.localStorage.getItem(STORAGE_KEY) === 'api' ? 'api' : 'mock'
}

export function DataSourceProvider({ children }: { children: ReactNode }) {
  const [dataSource, setDataSource] = useState<DataSource>(getInitialDataSource)
  const [isApiConfigured, setIsApiConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, dataSource)
  }, [dataSource])

  useEffect(() => {
    let isMounted = true

    getApiStatus()
      .then((status) => {
        if (!isMounted) return

        setIsApiConfigured(status.openAiConfigured)

        if (!status.openAiConfigured && getInitialDataSource() === 'api') {
          setDataSource('mock')
          toast.warning(MISSING_KEY_MESSAGE, {
            id: MISSING_KEY_TOAST_ID,
          })
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsApiConfigured(null)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const setUseApi = useCallback(
    (useApi: boolean) => {
      if (useApi && isApiConfigured === false) {
        setDataSource('mock')
        toast.warning(MISSING_KEY_MESSAGE, {
          id: MISSING_KEY_TOAST_ID,
        })
        return
      }

      setDataSource(useApi ? 'api' : 'mock')
    },
    [isApiConfigured]
  )

  const value = useMemo<DataSourceContextValue>(
    () => ({
      dataSource,
      useApi: dataSource === 'api',
      isApiConfigured,
      setUseApi,
    }),
    [dataSource, isApiConfigured, setUseApi]
  )

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  )
}
