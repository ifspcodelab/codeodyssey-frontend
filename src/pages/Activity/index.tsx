import PageHeader from "../../components/PageHeader";
import { Button, Grid, Typography } from "@mui/material";
import { useApiGetActivity } from "../../core/hooks/useApiGetActivity.ts";
import { useApiSendResolution } from "../../core/hooks/useApiSendResolution.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { ResolutionForm } from "../../core/models/ResolutionForm.ts"
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { schema } from "./schema.ts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18n";

function Activity() {
  const { getActivity } = useApiGetActivity()
  const { sendResolution } = useApiSendResolution()
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { idCourse, idActivity } = useParams()
  const [activity, setActivity] = useState();
  const convertBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const { t } = useTranslation();

  useEffect(() => {
    void (async () => {
      if ((idCourse !== undefined) && (idActivity !== undefined)) {
        const activityResponse = await getActivity(idCourse, idActivity, rawAccessToken);
        setActivity(activityResponse)
      } else {
        // Tratar erros
        console.log("Tratar erro")
      }
    })();
  }, [getActivity, idActivity, idCourse, rawAccessToken]);

  const authConsumer = AuthConsumer();
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    const [_, parts] = base64.split('base64,')
    return parts
  };
  const USER_ID: string = authConsumer.id;

  const onSubmit: SubmitHandler<ResolutionForm> = (data) => submitResolutionActivity(data)

  const { register, setValue, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  async function submitResolutionActivity(data: ResolutionForm) {
    try {
      if ((idCourse !== undefined) && (idActivity !== undefined)) {
        await sendResolution(data.resolutionFile, rawAccessToken, idCourse, idActivity);
      } else {
        // Tratar erros
        console.log("Tratar erro")
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <PageHeader title={activity?.title} text="Desc Example" />
      <Typography sx={{ fontSize: 14 }} gutterBottom>
        Professor:  {activity?.course.professor.name}
        <br />
        {t('activity.course')}: {activity?.course.name}
        <br />
        {t('activity.date')}: {new Date(activity?.course.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })} {t('activity.until')} {new Date(activity?.course.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}
        <br />
        {t('activity.initialfile')}: example.java
        <Button>{t('activity.button.download')}</Button>
      </Typography>

      {activity?.course.professor.id === USER_ID ? <span></span> : <Grid item xs={12}>
        <Typography sx={{ fontSize: 14 }}>
          {t('activity.title')}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="field"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                type="file"
                // accept={fileType}
                {...register("resolutionFile")}
                {...field}
                onChange={async (e) => {
                  const valorTransformado = await uploadImage(e);
                  setValue("resolutionFile", valorTransformado);
                }} />
            )} />

          <Grid item xs={12} textAlign="right">
            <Button variant="outlined" type="submit">{t('activity.button.resolution')}</Button>
          </Grid>
        </form>
      </Grid>}
      {/* <DropFileInput onFileChange={(files) => onFileChange(files)} /> */}
    </>
  );
}

export default Activity



















