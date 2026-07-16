'use client'
import { useState, useEffect } from "react";
import { getInvites, acceptInvites } from "@/app/services/invites";
import toast from "react-hot-toast";
import { useUser } from "@/app/context/UserContext";
import { Invite } from "@/app/types/next-invites";
import { FaCheck, FaTimes } from "react-icons/fa";

interface InvitesListProps {
    invites: Invite[];
    fetchInvites: () => Promise<void>;
}


const InvitesPage = () => {

    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const fetchInvites = async () => {
        setLoading(true)
        try {
            if (user?.id) {
                const result = await getInvites(user.id);
                const data = await result.json();

                if (result.ok) {
                    setInvites(data.invites);
                } else {
                    toast.error(data.message || 'Erro ao carregar membros!')
                }
            }

        } catch (err) {
            console.error(err);
            toast.error('Erro ao carregar membros!');
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {

        fetchInvites()

    }, [user])

    return (
        <div className="invites-container">
            <h2>Convites</h2>
            {
                loading ? <p className="alert">A carregar convites...</p> : invites.length > 0 ?

                    <InvitesList invites={invites} fetchInvites={fetchInvites}/>

                    : <p className="alert">Sem convites de momento!</p>
            }

        </div>
    )

}

const InvitesList = ({ invites, fetchInvites }: InvitesListProps) => {
    const handleInvite = async (id: number, status: number) => {
        try {
            const result = await acceptInvites(id, status);
            const body = await result.json();

            if (result.ok) {
                toast.success(body.message);
                fetchInvites();
            } else {
                toast.error(body.message);
            }

        } catch (error) {
            toast.error('Erro processar convite!')
            console.error(error);
        }
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Tag</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Projeto</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {invites.map((invite: Invite, index: number) =>
                    invite.status === 0 ? (
                        <tr key={invite.id || index}>
                            <td>{invite.invitedBy?.tag}</td>
                            <td>{invite.invitedBy ? `${invite.invitedBy.first_name} ${invite.invitedBy.last_name}` : ''}</td>
                            <td>{invite.description}</td>
                            <td>{invite.project?.title}</td>
                            <td>
                                <button onClick={() => invite.id && handleInvite(invite.id, 0)} style={{ backgroundColor: 'var(--success-color)' }}><FaCheck /></button>
                                <button onClick={() => invite.id && handleInvite(invite.id, 1)} style={{ backgroundColor: 'var(--error-color)' }}><FaTimes /></button>
                            </td>
                        </tr>
                    ) : null
                )}

            </tbody>
        </table>
    )
}

export default InvitesPage;