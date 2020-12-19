import React, { useState } from 'react';

import { PrimaryButton, TextField } from '@fluentui/react';

import './login.css';
import { restClient } from '../../Services/restClient';

export const Login = ({ history }) => {
    const [user, setUser] = useState({
        userId: '',
        password: ''
    });

    const [message, setMessage] = useState();

    const handleUserChange = prop => (event, value) => {
        setUser({ ...user, [prop]: value });
    }

    const hanleEnterCLick = async () => {
        if (!user.userId && !user.password) {
            return;
        }

        const response = await restClient.httpGet(`/usuario/${user.userId}/${user.password}`);

        debugger

        if (response === 'sucess') {
            history.push('/estudiantes');
        }

        setMessage(response);
    }

    return <div className="login">

        <div className="form">
            {/* <div className="line" /> */}

            <h2>Login</h2>

            <TextField
                label="Usuario"
                value={user.userId}
                underlined
                onChange={handleUserChange('userId')} />

            <TextField
                type="password"
                label="Contraseña"
                value={user.password}
                canRevealPassword
                underlined
                onChange={handleUserChange('password')} />

            <PrimaryButton text="Enter" onClick={hanleEnterCLick} />

            <span>{message}</span>
        </div>

    </div>
}