'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getMembers, inviteMember } from "@/app/services/projects"
import toast from "react-hot-toast"
import { Member } from "@/app/types/next-project"
import  Modal  from "@/app/(frontend)/components/modal"
import {useUser} from "@/app/context/UserContext"

interface MembersListProps {
    members: Member[];
    id: string;
}

const ProjectMembers = () => {


    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {user} = useUser();

    const handleModalStatus = () => {
        setIsModalOpen(!isModalOpen);
    }

    const fetchMembers = async () => {
        setLoading(true)
        try {
            if (id) {
                const result = await getMembers(Number(id));
                const data = await result.json();

                if (result.ok) {
                    setMembers(data.project_members);
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

        fetchMembers()

    }, [id])

    return (
        <>
            {isModalOpen ?
                <Modal handleStatus={handleModalStatus} title={'Convidar Membros'}>
                    <CreateForm userId={user?.id} handleModalStatus={handleModalStatus} projectId={id}/>
                </Modal>
                : null
            }
            <div className="members-container">
                <h2>Membros</h2>
                <button className="btn-invite" onClick={handleModalStatus}>Convidar Membros</button>
                {
                    loading ? <p className="alert">A carregar...</p>
                        : members.length === 0 ?
                            <p className="alert">Sem membros</p>
                            :
                            <MembersList members={members} id={user?.id || ''}/>
                }

            </div>
        </>
    )
}


const MembersList = ({ members, id }: MembersListProps) => {
    return (
        <div className="members-list">
            {
                members.map((member) =>
                    <MemberItem key={member.user.id} member={member} id={id}/>
                )
            }

        </div>
    )
}

const MemberItem = ({ member, id }: any) => {

    function calculateTime(lastLogVal: string | Date): string {

        const lastLog = new Date(lastLogVal);

        const currentDate = new Date();
        const diffMs = currentDate.getTime() - lastLog.getTime();
        const diffMins = Math.floor(diffMs / 1000 / 60);


        if (diffMins < 1) return "Online há momentos";
        if (diffMins < 60) return `Online há ${diffMins} minutos`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Online há ${diffHours}h`;

        const diffDays = Math.floor(diffHours / 24);
        return `Online há ${diffDays} dias`;
    }

    const handleRemoveMember = async (userId: number) => {

    }


    return (

        <div className="member-item">
            <img src={member.user.image_url || "/user.png"}></img>
            <h3>{member.user.first_name + ' ' + member.user.last_name}</h3>
            <div className="info">
                <p>Função: {member.role.role}</p>
                {
                    member.user.status == 1 ? <p style={{ backgroundColor: 'rgb(96, 213, 96)', fontWeight: 'bold' }}>Online</p> : <p style={{ backgroundColor: 'rgb(241, 38, 38)', fontWeight: 'bold' }}>{calculateTime(member.user.last_login)}</p>
                }
                {member.role_id != 1 && member.user.id != id ? <button className="btn-remove" onClick={() => handleRemoveMember(member.user.id)}>Remover</button> : null}

            </div>
        </div>
    )
}

const CreateForm = ({handleModalStatus, userId, projectId}:any) => {

    const [loading, setLoading] = useState(false);

    const newInvite = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { tag, description } = e.currentTarget.elements as any;

        const data = {tag: tag.value, description: description.value, project_id: projectId, invitedBy_id: userId};
        setLoading(true);

        try {
            const result = await inviteMember(data);
            const body = await result.json();

            if (result.ok) {
                toast.success(body.message);
                handleModalStatus();
            } else {
                toast.error(body.message);
            }


        } catch (error) {
            toast.error('Erro ao enviar convite!')
            console.error(error);
        } finally {
            setLoading(false);
        }


    }

    return (
        <form onSubmit={newInvite}>
            <div className="form-group">
                <label htmlFor="tag">Título</label>
                <input type="text" name="tag" placeholder="Tag" required />
            </div>
            <div className="form-group">
                <label htmlFor="description">Título</label>
                <textarea rows={8} name="description" placeholder="Descrição"></textarea>
            </div>
            <button type="submit">{!loading ? 'Enviar' : 'A enviar...'}</button>
        </form>

    )
}
export default ProjectMembers;