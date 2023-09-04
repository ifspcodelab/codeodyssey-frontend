import { useApiGetStudents } from "../../core/hooks/useApiGetStudents.ts";
import { useEffect, useState } from "react";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { JwtService } from "../../core/auth/JwtService.ts";
import { useParams } from "react-router-dom";
import { StudentResponse } from "../../core/models/StudentResponse";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/PageHeader";

function Students() {
  const [students, setStudents] = useState<StudentResponse[] | ProblemDetail>([]);
  const { getStudents } = useApiGetStudents()
  const authConsumer = AuthConsumer();
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { slug } = useParams()
  const { t } = useTranslation();
  const USER_ID: string = authConsumer.id;
  useEffect(() => {
    void (async () => {
      if (typeof slug === 'string') {
        try {
          console.log(typeof slug)
          const studentsResponse = await getStudents(USER_ID, slug, rawAccessToken)
          setStudents(studentsResponse)
          console.log("id: ", slug)
          console.log("teste", studentsResponse)
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log("error")
      }

    })();
    // eslint-disable-next-line
  }, [rawAccessToken]);


  return (
    <>
      <PageHeader title={t('students.title')} text={t('students.text')} />
      <div>
        {Array.isArray(students) && students.map((student: StudentResponse) => (
          <Card key={student.id} variant="outlined" className="cardContainer">
            <CardContent>
              <Typography variant="h5" component="div">
                {t('students.name')}: {student.name}
              </Typography>
              <Typography variant="h5" component="div">
                {t('students.email')}: {student.email}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export default Students