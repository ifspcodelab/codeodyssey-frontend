export interface IResultResponse {
  name: string;
  time: number;
  error: string;
  testCases: ITestCaseResponse[];
}

export interface ITestCaseResponse {
  id: string;
  testName: string;
  success: boolean;
  info: string;
  time: number;
}