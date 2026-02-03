interface SignUpPageProps {
    handleAuthPage: () => void;
}

const SignUpPage = ({handleAuthPage}: SignUpPageProps) => {
    return (
        <div className="signup-container">
           <h2>Registe-se</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="first-name">Nome:</label>
                    <input type="text" placeholder="Nome" required />
                </div>

                <div className="form-group">
                    <label htmlFor="last-name">Apelido:</label>
                    <input type="text" placeholder="Apelido" required />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" placeholder="Email" required />
                </div>

                <div className="form-group">

                    <label htmlFor="password">Password:</label>
                    <input type="password" placeholder="Password" required />
                </div>

                <button type="submit" onClick={handleAuthPage}>Registar</button>
            </form>
        </div>
    );
}

export default SignUpPage;