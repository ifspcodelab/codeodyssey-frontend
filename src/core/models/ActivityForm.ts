export interface ActivityForm {
  criteria: {
    name: string;
    weight: number;
  }[];
  title: string;
  description: string;
  language: string;
  startDate: Date;
  endDate: Date;
  initialFile: File;
  testFile: File;
  solutionFile: File;
}