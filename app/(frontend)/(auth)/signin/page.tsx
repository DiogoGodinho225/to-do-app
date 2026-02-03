'use client';

interface SignInPageProps {
    handleAuthPage: () => void;
}

const SignInPage = ({handleAuthPage}: SignInPageProps) => {
    return (
        <div className="signin-container">
            <h2>Login</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" placeholder="Email" required />
                </div>
                <div className="form-group">

                    <label htmlFor="password">Password:</label>
                    <input type="password" placeholder="Password" required />
                </div>

                <button type="submit">Login</button>
            </form>
            <p>Ainda não tem conta? <a href='#' onClick={handleAuthPage}>Registe-se!</a></p>
        </div>
    )

}

export default SignInPage;