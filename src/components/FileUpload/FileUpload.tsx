import { ChangeEvent, useState } from 'react';
import { Controller } from "react-hook-form";
import "./style.css";
import { useTranslation } from "react-i18next";
import { FieldValues, FieldPath, Control } from 'react-hook-form';

interface FileUploadProps {
  fieldName: FieldPath<FieldValues>;
  register: (name: FieldPath<FieldValues>, options?: { shouldValidate: boolean }) => void;
  setValue: (name: FieldPath<FieldValues>, value: any, options?: { shouldDirty?: boolean }) => void;
  control: Control<FieldValues>;
  fileType: string;
  errors: {
    [K in FieldPath<FieldValues>]?: {
      message: string;
    };
  };
}

const FileUpload = (props: FileUploadProps) => {
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
    props.setValue(props.fieldName, null);
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
            control={props.control}
            defaultValue=""
            render={({ field }) => (
              <input {...props.register(props.fieldName)} {...field} accept={props.fileType} type="file" onChange={async (e) => {
                const valorTransformado = await uploadImage(e);
                props.setValue(props.fieldName, valorTransformado);
              }} />
            )}
          />
          {props.errors[props.fieldName] && <span style={{ color: "red" }}>{props.errors[props.fieldName].message}</span>}
        </div>
        <button type="button" onClick={resetInputFile}>
          X
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
