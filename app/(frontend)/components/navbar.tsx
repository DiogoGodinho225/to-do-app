'use client';
import { FaProjectDiagram, FaUserCircle, FaEnvelopeOpenText, FaSignOutAlt } from 'react-icons/fa'
import { signOut } from 'next-auth/react';
import {useSession} from 'next-auth/react';

const navbar = () => {

    const {data: session} = useSession();

    const handleUserStatus = () => {
        alert('User logged out');
    }

    return (
        <header>
            <nav>
                <h1><a href="/my-projects">To-Do</a></h1>
                <div className="user"><img src={session?.user?.image || '/user.png'} /><span>{session?.user?.name}</span></div>
                <ul>
                    <li><a href="/my-projects"><span className='icon'><FaProjectDiagram style={{width: '100%', height: '100%'}}/></span > <span className='label'>Meus projetos</span></a></li>
                    <li><a href="/invites"><span className='icon'><FaEnvelopeOpenText style={{width: '100%', height: '100%'}} /></span> <span className='label'>Convites</span></a></li>
                    <li><a href="/profile"><span className='icon'><FaUserCircle style={{width: '100%', height: '100%'}}/></span> <span className='label'>Perfil</span></a></li>
                    <li><a href="#" onClick={() => { signOut({callbackUrl: '/'}); handleUserStatus(); }}><span className='icon'><FaSignOutAlt style={{width: '100%', height: '100%'}}/></span> <span className='label'>Log Out</span></a></li>
                </ul>
            </nav>
        </header>
    );

}

export default navbar;