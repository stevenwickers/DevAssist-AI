import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  DataSourceContext,
  type DataSource,
  type DataSourceContextValue,
} from './data-source-context.ts'

const STORAGE_KEY = 'devassist-ai-data-source'

function getInitialDataSource(): DataSource {
  if (typeof window === 'undefined') {
    return 'mock'
  }

  return window.localStorage.getItem(STORAGE_KEY) === 'api' ? 'api' : 'mock'
}

export function DataSourceProvider({ children }: { children: ReactNode }) {
  const [dataSource, setDataSource] = useState<DataSource>(getInitialDataSource)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, dataSource)
  }, [dataSource])

  const value = useMemo<DataSourceContextValue>(
    () => ({
      dataSource,
      useApi: dataSource === 'api',
      setUseApi: (useApi) => setDataSource(useApi ? 'api' : 'mock'),
    }),
    [dataSource]
  )

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  )
}
