import { Grid, TextField } from "@mui/material";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";

interface TextAreaProps {
  fieldName: string;
  labelName: string;
  minRows: number;
  maxRows: number;
}

function TextAreaField(props: TextAreaProps) {
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
          label={t(props.labelName)}
          variant="outlined"
          multiline
          minRows={props.minRows}
          maxRows={props.maxRows}
          error={!!errors?.[props.fieldName]}
          helperText={errors?.[props.fieldName]?.message ? (
            <span>{errors[props.fieldName]!.message!.toString()}</span>
          ) : null}
        />
      </Grid>
    </div>
  );
}

export default TextAreaField;
