import { useContext } from 'react'

import { DataSourceContext } from './data-source-context.ts'

export function useDataSource() {
  const context = useContext(DataSourceContext)

  if (!context) {
    throw new Error('useDataSource must be used within DataSourceProvider')
  }

  return context
}
