'use client';
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


interface SignInPageProps {
    handleAuthPage: () => void;
}

const SignInPage = ({handleAuthPage}: SignInPageProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const signInUser = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const {email, password} = e.currentTarget.elements as any;

        const res = await signIn('credentials', {
            redirect: false,
            email: email.value,
            password: password.value,
        });

        if(res?.ok){
            toast.success('Login efetuado com sucesso!');
            router.push('/my-projects');
        }else{
            toast.error('Credenciais inválidas!');
        }

        setLoading(false);

    }

    return (
        <div className="signin-container">
            <h2>Login</h2>
            <form onSubmit={signInUser}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name='email' placeholder="Email" required />
                </div>
                <div className="form-group">

                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" placeholder="Password" required />
                </div>

                <button type="submit">{loading ? 'A entrar...' : 'Login'}</button>
            </form>
            <p>Ainda não tem conta? <a href='#' onClick={handleAuthPage}>Registe-se!</a></p>
        </div>
    )

}

export default SignInPage;