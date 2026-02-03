'use client';

import SignInPage from "../signin/page";
import SignUpPage from "../signup/page";
import { useState } from "react";


const AuthPage = () => {

    const [signInPage, setSignInPage] = useState(true);
    const [signUpPage, setSignUpPage] = useState(false);

    return (
        <div className="auth-container">
            <div className="form-zone">
                 {signInPage === false && signUpPage ? <SignUpPage /> : <SignInPage />}
            </div>
            <div className="image-zone">
                <img src="/auth-image.png" alt="Auth Image" />
            </div>
        </div>
    );
}


export default AuthPage;