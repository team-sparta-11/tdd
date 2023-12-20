export interface ICommand {
  cmd: string;
  data?: unknown;
}

export interface IQuery {
  query: string;
  data?: unknown;
}

export interface ICmdManager {
  execute<T>(cmd: ICommand): Promise<T>;
}

export interface IQueryManager {
  execute<T>(query: IQuery): Promise<T>;
}
