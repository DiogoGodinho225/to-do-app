'use client'
import { useUser } from "@/app/context/UserContext";
import { editUser } from "@/app/services/user";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

const UserPage = () => {

    const [formIsOpen, setFormIsOpen] = useState(false);

    const handleForm = () => {
        setFormIsOpen(!formIsOpen);
    }

    const { data: session, status } = useSession();
    const {user, fetchUser, loading} = useUser();

    return (
        <div className="user-container">
            {loading ? (
                <p className="alert">A carregar...</p>
            ) : formIsOpen ? (
                <UserForm user={user} fetchUser={fetchUser} handleForm={handleForm} />
            ) : (
                <UserInfo user={user} handleForm={handleForm} />
            )}
        </div>
    );
}

const UserInfo = ({ user, handleForm }: any) => {


    return (
        <>
            <div className="img-zone">
                <img src={user?.image_url || '/user.png'} />
            </div>
            <div className="info">
                <table>
                    <tbody>
                        <tr>
                            <th>Nome:</th>
                            <td>{user?.first_name}</td>
                        </tr>
                        <tr>
                            <th>Apelido:</th>
                            <td>{user?.last_name}</td>
                        </tr>
                        <tr>
                            <th>Email:</th>
                            <td>{user?.email}</td>
                        </tr>
                        <tr>
                            <th>Tag:</th>
                            <td><strong>{user?.tag}</strong></td>
                        </tr>
                        <tr>
                            <th>Criado em:</th>
                            <td>{new Date(user?.created_at).toLocaleString()}</td>

                        </tr>
                    </tbody>
                </table>
            </div>
            <button onClick={handleForm}>Editar Perfil</button>
        </>
    )

}


const UserForm = ({ user, fetchUser, handleForm }: any) => {

    const [loading, setLoading] = useState(false);


    const submitEditUser = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        const { first_name, last_name, email } = e.currentTarget.elements as any;
        const image = (e.currentTarget.elements as any).image.files[0];
        try {
            const formData = new FormData();
            formData.append('first_name', first_name.value);
            formData.append('last_name', last_name.value);
            formData.append('email', email.value);
            formData.append('image', image);

            const data = await editUser(formData, Number(user?.id));
            const res = await data.json();

            if (data.ok) {
                toast.success(res.message || 'Utilizador atualizado!');

                fetchUser(user.id);

                handleForm()
            } else {
                toast.error(res.message || 'Erro ao atualizar dados!')
            }
        } catch (err) {
            console.error(err);
            toast.error('Erro ao editar utilizador.');
        }finally{
            setLoading(false);
        }

    }

    return (
        <form onSubmit={submitEditUser}>
            <h2>Editar Perfil</h2>
            <div className="form-group">
                <label htmlFor="first_name">Nome:</label>
                <input type="text" name="first_name" defaultValue={user?.first_name} required />
            </div>
            <div className="form-group">
                <label htmlFor="last_name">Nome:</label>
                <input type="text" name="last_name" defaultValue={user?.last_name} required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Nome:</label>
                <input type="email" name="email" defaultValue={user?.email} required />
            </div>
            <div className="form-group">
                <label htmlFor="image">Nome:</label>
                <input type="file" name="image" />
            </div>
            <button type="submit">{loading ? 'A editar' : 'Editar'}</button>
        </form>
    )
}


export default UserPage;