import { createContext } from 'react'

export type DataSource = 'mock' | 'api';

export type DataSourceContextValue = {
  dataSource: DataSource;
  useApi: boolean;
  setUseApi: (value: boolean) => void;
};

export const DataSourceContext =
  createContext<DataSourceContextValue | null>(null)
