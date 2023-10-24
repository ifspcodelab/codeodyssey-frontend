import { ChangeEvent, useState } from 'react';
import { Controller, useFormContext } from "react-hook-form";
import "./style.css";
import { useTranslation } from "react-i18next";

interface FileUploadProps {
  fieldName: string;
  fileType: string;
}

const FileUpload = (props: FileUploadProps) => {
  const [selectedName, setSelectedName] = useState("");
  const { t } = useTranslation();

  const { register, setValue, control,
    formState: { errors } } = useFormContext()

  const convertBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // const uploadImage = async (e: ChangeEvent<HTMLInputElement>): Promise<string | null> => {
  //   if (e.target.files !== null) {
  //     const file = e.target.files[0];
  //     const base64: string = await convertBase64(file);
  //     const [, parts] = base64.split('base64,');
  //     setSelectedName(file.name);
  //     return parts.toString();
  //   }
  //   return null;
  // };

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>): Promise<string | null> => {
    if (e.target.files !== null && e.target.files.length > 0) {
      const file = e.target.files[0];
      const base64: string = await convertBase64(file);
      const [, parts] = base64.split('base64,');
      setSelectedName(file.name);
      return parts.toString();
    }
    return null;
  };

  const resetInputFile = () => {
    setValue(props.fieldName, null);
    setSelectedName('')
  };

  return (
    <div className="app">
      <div className="parent">
        <h3>{props.fieldName}</h3>
        <div className="file-upload">
          <h3> {selectedName || t('activity.form.resolution')}</h3>
          <Controller
            name="field"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input {...register(props.fieldName)} {...field} accept={props.fileType} type="file" onChange={async (e) => {
                const convertedValue = await uploadImage(e);
                setValue(props.fieldName, convertedValue);
              }} />
            )}
          />
          {errors?.[props.fieldName]?.message ? (
            <span>{errors[props.fieldName]!.message!.toString()}</span>
          ) : null}
        </div>
        <button type="button" onClick={resetInputFile}>
          X
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
