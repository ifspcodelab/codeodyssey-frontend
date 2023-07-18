import PageHeader from "../../components/PageHeader";
import {useTranslation} from "react-i18next";
import {Container} from "@mui/material";

function CreateCourse() {
  const {t} = useTranslation();


  return (
    <Container maxWidth="md">
      <PageHeader title={t('createcourse.title')} text={t('createcourse.text')} />

    </Container>


  )

}

export default CreateCourse