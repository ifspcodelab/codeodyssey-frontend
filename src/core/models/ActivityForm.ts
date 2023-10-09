export interface ActivityForm {
  // criteria: {
  //   name: string;
  //   weight: number;
  // }[];
  title: string;
  description: string;
  extension: string;
  startDate: Date;
  endDate: Date;
  initialFile: string;
  testFile: string;
  solutionFile: string;
}