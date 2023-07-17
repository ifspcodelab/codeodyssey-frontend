import React, {useState} from 'react';
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import './styles.css'
import {useNavigate} from "react-router-dom"

interface RegistrationData {
    name: string;
    email: string;
    password: string;
}

function Registration() {
    const registrationData: RegistrationData = {name: "", email: "", password: ""}
    const [formData, setFormData] = useState(registrationData)
    const navigate = useNavigate()

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(formData)
    }

    const handleLogin = () => {
        return navigate("/login")
    }

    return (
        <>
            <div className="formContainer">
                <PageHeader title={"Registration"} text={"Form to register on the platform"}/>
                <form onSubmit={handleSubmit}>
                    <div className="formInput">
                        <label htmlFor={"name"}>Name</label>
                        <input type="text" name="name" onChange={inputChangeHandler}/>
                    </div>
                    <div className="formInput">
                        <label htmlFor={"email"}>Email</label>
                        <input type="text" name="email" onChange={inputChangeHandler}/>
                    </div>
                    <div className="formInput">
                        <label htmlFor={"password"}>Password</label>
                        <input type="password" name="password" onChange={inputChangeHandler}/>
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