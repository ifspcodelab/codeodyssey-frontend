import React, { useState } from "react";
import { useForm } from "react-hook-form";

const EncodeBase64 = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [fileBase64String, setFileBase64String] = useState("");

  const onFileChange = (file) => {
    // const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result;
        console.log(base64String);
        setFileBase64String(base64String);
        setValue("file", base64String); // Define o valor convertido como string para o campo "file"
        return base64String
      };
      reader.onerror = (error) => {
        console.error("Error: ", error);
      };
    }
  };

  const onSubmit = (data) => {
    // Aqui você pode enviar data.file como uma string para a API
    console.log("Dados do formulário:", data);
    console.log(data.file[0])
    const teste = onFileChange(data.file[0])
    console.log(teste)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="file"
          id="input"
          onChange={onFileChange}
          {...register("file", {
            setValueAs: (value) => value, // Manter o valor como uma string
            shouldUnregister: false, // Garantir que o valor não seja desregistrado quando o campo é removido
          })}
        />
      </div>
      <div>
        <button type="submit">Enviar</button>
      </div>
    </form>
  );
};

export default EncodeBase64;
