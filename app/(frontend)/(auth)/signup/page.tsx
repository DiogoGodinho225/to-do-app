import { useState } from 'react';
import { toast } from 'react-hot-toast';


interface SignUpPageProps {
    handleAuthPage: () => void;
}

const SignUpPage = ({ handleAuthPage }: SignUpPageProps) => {

    const [loading, setLoading] = useState(false);


    const registerUser = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const { first_name, last_name, email, password } = e.currentTarget.elements as any;

        fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: first_name.value,
                last_name: last_name.value,
                email: email.value,
                password: password.value,
            })
        })
            .then(async res => {
                const data = await res.json();

                if (res.ok) {
                    toast.success(data.message);
                    handleAuthPage();
                } else {
                    toast.error(data.message || 'Erro ao registar utilizador.');
                }

            })
            .catch(err => {
                console.error(err);
                toast.error('Erro ao registar utilizador.');
            })
            .finally(() => setLoading(false));

    }

    return (
        <div className="signup-container">
            <h2>Registe-se</h2>
            <form onSubmit={registerUser}>
                <div className="form-group">
                    <label htmlFor="first-name">Nome:</label>
                    <input type="text" name='first_name' placeholder="Nome" required />
                </div>

                <div className="form-group">
                    <label htmlFor="last-name">Apelido:</label>
                    <input type="text" name='last_name' placeholder="Apelido" required />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name='email' placeholder="Email" required />
                </div>

                <div className="form-group">

                    <label htmlFor="password">Password:</label>
                    <input type="password" name='password' placeholder="Password" required />
                </div>

                <button type="submit">{loading ? 'A criar conta...' : 'Registar'}</button>
            </form>
            <p>Já tem conta? <a href='#' onClick={handleAuthPage}>Login!</a></p>
        </div>
    );
}

export default SignUpPage;