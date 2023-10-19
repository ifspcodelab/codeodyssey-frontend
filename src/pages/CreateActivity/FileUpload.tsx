import { ChangeEvent, useState } from 'react';
import { Controller } from "react-hook-form";
import "./style.css";
import { useTranslation } from "react-i18next";

const FileUpload = ({ fieldName, register, setValue, control, fileType, errors }) => {
  const [selectedName, setSelectedName] = useState("");
  const { t } = useTranslation();

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

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>): Promise<string | null> => {
    if (e.target.files !== null) {
      const file = e.target.files[0];
      const base64: string = await convertBase64(file);
      const [, parts] = base64.split('base64,');
      setSelectedName(file.name);
      return parts;
    }
    return null;
  };

  const resetInputFile = () => {
    setValue(fieldName, null);
    setSelectedName('')
  };

  return (
    <div className="app">
      <div className="parent">
        <div className="file-upload">
          <h3> {selectedName || t('activity.form.resolution')}</h3>
          <Controller
            name="field"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input {...register(fieldName)} {...field} accept={fileType} type="file" onChange={async (e) => {
                const valorTransformado = await uploadImage(e);
                setValue(fieldName, valorTransformado);
              }} />
            )}
          />
          {errors[fieldName] && <span style={{ color: "red" }}>{errors[fieldName].message}</span>}
        </div>
        <button type="button" onClick={resetInputFile}>
          X
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
