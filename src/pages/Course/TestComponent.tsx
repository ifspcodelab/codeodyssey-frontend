import { Card, CardContent, Typography } from '@mui/material'
import { CourseResponse } from '../../core/models/CourseResponse';

interface ITestComponentProps {
  course: CourseResponse
}

const TestComponent: React.FC<ITestComponentProps> = ({ course }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{course?.name}</Typography>
        <Typography variant="subtitle1">Professor: {course?.professor?.name}</Typography>
        <Typography>Data de Início: {course?.startDate}</Typography>
        <Typography>Data de Término: {course?.endDate}</Typography>
      </CardContent>
    </Card>
  )
}

export default TestComponent