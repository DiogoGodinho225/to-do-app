'use client';
import { FaProjectDiagram, FaUserCircle, FaEnvelopeOpenText, FaSignOutAlt } from 'react-icons/fa'
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { editUser } from '@/app/services/user';

const Navbar = () => {

    const { data: session } = useSession();


    const handleUserStatus = async () => {


        if (!session?.user?.id) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('status', '0');
            formData.append('last_login', (new Date()).toString());

            const data = await editUser(formData, Number(session?.user?.id));
            const res = await data.json();

            if (res.ok) {
                signOut({ callbackUrl: '/' });
                alert('Sessão terminada!');
            } else {
                toast.error(res.message || 'Erro ao terminar sessão!')
            }
        } catch (err) {
            console.error(err);
            toast.error('Erro ao registar utilizador.');
        }

    }

    return (
        <header>
            <nav>
                <h1><a href="/my-projects">To-Do</a></h1>
                <div className="user"><img src={session?.user?.image || '/user.png'} /><span>{session?.user?.name}</span></div>
                <ul>
                    <li><a href="/my-projects"><span className='icon'><FaProjectDiagram style={{ width: '100%', height: '100%' }} /></span > <span className='label'>Meus projetos</span></a></li>
                    <li><a href="/invites"><span className='icon'><FaEnvelopeOpenText style={{ width: '100%', height: '100%' }} /></span> <span className='label'>Convites</span></a></li>
                    <li><a href="/profile"><span className='icon'><FaUserCircle style={{ width: '100%', height: '100%' }} /></span> <span className='label'>Perfil</span></a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleUserStatus(); }}><span className='icon'><FaSignOutAlt style={{ width: '100%', height: '100%' }} /></span> <span className='label'>Log Out</span></a></li>
                </ul>
            </nav>
        </header>
    );

}

export default Navbar;