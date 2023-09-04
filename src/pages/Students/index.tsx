
import { useApiGetStudents} from "../../core/hooks/useApiGetStudents.ts";
import { useEffect, useState } from "react";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { JwtService } from "../../core/auth/JwtService.ts";
import { useParams } from "react-router-dom";
interface Student {
  id: string,
  name: string,
  email: string
}

function Students() {
  const [students, setStudents] = useState<Student[] | ProblemDetail>([]);
  const { getStudents } = useApiGetStudents()
  const authConsumer = AuthConsumer();
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { slug } = useParams()
  
  const USER_ID: string = authConsumer.id;
  useEffect(() => {
    void (async () => {
        try {
          const cursoAluno = await getStudents(USER_ID, slug, rawAccessToken)
          setStudents(cursoAluno)
          console.log("id: ", slug)
          console.log("teste" , cursoAluno)
        } catch (error) {
          console.log(error)
      }
    })();
    // eslint-disable-next-line
  }, [rawAccessToken]);


  return (
      <>
          <h1>Students</h1>
          <div>
          {Array.isArray(students) && students.map((student: Student) => (
                <Card key={student.id} variant="outlined" className="cardContainer">
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {student.name}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {student.email}
                    </Typography>
                  
                  </CardContent>

               
                </Card>
              ))}
          </div>
      </>
  );
}

export default Students