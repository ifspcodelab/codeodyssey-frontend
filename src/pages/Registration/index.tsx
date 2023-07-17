import React, {useState} from 'react';
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import './styles.css'
import {useNavigate} from "react-router-dom"
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
    name: yup.string().required().min(5).max(100),
    email: yup.string().required().email(),
    password: yup.string().min(8).max(64)
}).required()

function Registration() {
    const { register, handleSubmit, formState: { errors} } = useForm({ resolver: yupResolver(schema)})
    const navigate = useNavigate()
    const onSubmit = (data) => console.log(data)

    const handleLogin = () => {
        return navigate("/login")
    }

    return (
        <>
            <div className="formContainer">
                <PageHeader title={"Registration"} text={"Form to register on the platform"}/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="formInput">
                        <label htmlFor={"name"}>Name</label>
                        <input type="text" name="name" {...register("name", { required: true })} />
                        <p>{errors.name?.message}</p>
                    </div>
                    <div className="formInput">
                        <label htmlFor={"email"}>Email</label>
                        <input type="text" name="email" {...register("email", { required: true })} />
                        <p>{errors.email?.message}</p>
                    </div>
                    <div className="formInput">
                        <label htmlFor={"password"}>Password</label>
                        <input type="password" name="password" {...register("password", { required: true })} />
                        <p>{errors.password?.message}</p>
                    </div>
                    <div className={"checkbox"}>
                        <input type="checkbox" id="terms"/>
                        <label htmlFor="terms">I have read and accept the terms of use</label>
                    </div>
                    <div id="buttons">
                        <button onClick={handleLogin}>Login</button>
                        <button type="submit">Submit</button>
                    </div>
                </form>
                <PageFooter id="footer" text={"Accept the terms to use the platform"}/>
            </div>
        </>
    );
}

export default Registration;