export interface ActivityForm<T = any> {

  title: string;
  description: string;
  extension: string;
  startDate: Date;
  endDate: Date;
  initialFile: T ;
  testFile: T ;
  solutionFile: T ;
}