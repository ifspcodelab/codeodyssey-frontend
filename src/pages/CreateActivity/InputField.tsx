import { Grid, TextField } from "@mui/material";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";

interface FileUploadProps {
  fieldName: string;
}

function InputField(props: FileUploadProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <div>
      <Grid item xs={12}>
        <TextField
          sx={{ width: "100%" }}
          {...register(props.fieldName)}
          label={t('createactivity.form.desc')}
          variant="outlined"
          multiline
          maxRows={5}
          error={!!errors?.[props.fieldName]}
          helperText={errors?.[props.fieldName]?.message ? (
            <span>{errors[props.fieldName]!.message!.toString()}</span>
          ) : null}
        />
      </Grid>
    </div>
  );
}

export default InputField;
