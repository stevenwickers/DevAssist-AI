import { createContext } from 'react'

export type DataSource = 'mock' | 'api';

export type DataSourceContextValue = {
  dataSource: DataSource;
  useApi: boolean;
  isApiConfigured: boolean | null;
  setUseApi: (value: boolean) => void;
};

export const DataSourceContext =
  createContext<DataSourceContextValue | null>(null)
