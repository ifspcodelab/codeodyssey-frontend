export interface IActivityResponse {
  id: string,
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  initialFile: string,
  solutionFile: string,
  testFile: string,
  extension: string,
}

export interface IActivityRequest<T = unknown> {
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  initialFile: T,
  solutionFile: T,
  testFile: T,
  extension: string,
}