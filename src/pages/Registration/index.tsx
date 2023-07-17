import React, {useState} from 'react';
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";

interface RegistrationData {
    name: string;
    email: string;
    password: string;
}

function Registration() {
    const registrationData: RegistrationData = {name: "", email: "", password: ""}
    const [formData, setFormData] = useState(registrationData)

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(formData)
    }

    return (
        <>
            <PageHeader title={"Registration"} text={"Form to register on the platform"}/>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor={"name"}>Name</label>
                    <input type="text" name="name" onChange={inputChangeHandler}/>
                </div>
                <div>
                    <label htmlFor={"email"}>Email</label>
                    <input type="text" name="email" onChange={inputChangeHandler}/>
                </div>
                <div>
                    <label htmlFor={"password"}>Password</label>
                    <input type="password" name="password" onChange={inputChangeHandler}/>
                </div>
                <button type="submit">Submit</button>
            </form>
            <PageFooter/>
        </>
    );
}

export default Registration;