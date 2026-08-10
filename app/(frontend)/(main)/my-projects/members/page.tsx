'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { getMembers, inviteMember, removeMember } from "@/app/services/projects"
import { getPermissions, givePermissions } from "@/app/services/permissions"
import toast from "react-hot-toast"
import { Member, Permission } from "@/app/types/next-project"
import Modal from "@/app/(frontend)/components/modal"
import { useUser } from "@/app/context/UserContext"
import ReturnButton from "@/app/(frontend)/components/returnButton"

interface MembersListProps {
    members: Member[];
    id: string;
    fetchMembers: () => Promise<void>,
}

interface PermissionsList {
    memberPermissions: Permission[];
    setMemberPermissions: (newPermissions: Permission[]) => void;
    userId: number,
    projectId: number,
    disabled: boolean,
}

export const dynamic = 'force-dynamic';

const ProjectMembers = () => {

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useUser();

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
                    <CreateForm userId={user?.id} handleModalStatus={handleModalStatus} projectId={id} />
                </Modal>
                : null
            }
            <div className="members-container">
                <h2>Membros</h2>
                <button className="btn-invite" onClick={handleModalStatus}>Convidar Membros</button>
                {
                    loading || !id ? <p className="alert">A carregar...</p>
                        : members.length === 0 ?
                            <p className="alert">Sem membros</p>
                            :
                            <MembersList members={members} id={user?.id || ''} fetchMembers={fetchMembers}/>
                }
                <ReturnButton />
            </div>
        </>
    )
}


const MembersList = ({ members, id, fetchMembers }: MembersListProps) => {
    return (
        <div className="members-list">
            {
                members.map((member) =>
                    <MemberItem key={member.user.id} member={member} id={id} iAmAdmin={members.some(m => Number(m.user_id) == Number(id) && m.role_id == 1)} iHavePermission={members.some(m => Number(m.user_id) === Number(id) && 
                            m.user?.member_permissions?.some((mp: any) => mp.permission_id === 5))} fetchMembers={fetchMembers}/>
                )
            }

        </div>
    )
}

const MemberItem = ({ member, id, iAmAdmin,  iHavePermission, fetchMembers}: any) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberPermissions, setMemberPermissions] = useState(member.user.member_permissions || []);

    const handleModalStatus = () => {
        if (isModalOpen) {
            savePermissions();
        }

        if (member.role_id != 1) {
            setIsModalOpen(!isModalOpen);
        }
    }

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

    const savePermissions = async () => {
        try {
            const result = await givePermissions(memberPermissions, member.user_id, member.project_id, id);
            const data = await result.json();

            if (result.ok) {
                toast.success(data.message);

            } else {
                toast.error(data.message || 'Erro ao guardar permissões!')
            }

        } catch (err) {
            console.error(err);
            toast.error('Erro ao guardar permissões!');
        }

    }

    const handleRemoveMember = async (userId: number) => {
        try {
            const result = await removeMember(userId,member.project_id, id);
            const data = await result.json();

            if (result.ok) {
                toast.success(data.message);
                fetchMembers();
            } else {
                toast.error(data.message || 'Erro ao guardar permissões!')
            }

        } catch (err) {
            console.error(err);
            toast.error('Erro ao guardar permissões!');
        }

    }

    const handleDisabled = () =>{
        if(member.user_id == id){
            return true
        }

        if(iHavePermission){
            return false
        }

        if(iAmAdmin){
            return false;
        }

        return true;
    }


    return (


        <>
            {isModalOpen ?
                <Modal handleStatus={handleModalStatus} title={'Permissões de membro'}>
                    <PermissionsList memberPermissions={memberPermissions} setMemberPermissions={setMemberPermissions} userId={member.user_id} projectId={member.project_id} disabled={handleDisabled()} />
                </Modal>
                : null
            }
            
            <div onClick={handleModalStatus} className="member-item">
                <img src={member.user.image_url || "/user.png"}></img>
                <h3>{member.user.first_name + ' ' + member.user.last_name}</h3>
                <div className="info">
                    <p>Função: {member.role.role}</p>
                    {
                        member.user.status == 1 ? <p style={{ backgroundColor: 'rgb(96, 213, 96)', fontWeight: 'bold' }}>Online</p> : <p style={{ backgroundColor: 'rgb(241, 38, 38)', fontWeight: 'bold' }}>{calculateTime(member.user.last_login)}</p>
                    }
                    {member.role_id != 1 && member.user.id != id ? <button className="btn-remove" onClick={(e) => {handleRemoveMember(member.user.id); e.stopPropagation()}}>Remover</button> : null}

                </div>
            </div>
        </>
    )
}

const CreateForm = ({ handleModalStatus, userId, projectId }: any) => {

    const [loading, setLoading] = useState(false);

    const newInvite = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { tag, description } = e.currentTarget.elements as any;

        const data = { tag: tag.value, description: description.value, project_id: projectId, invitedBy_id: userId };
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

const PermissionsList = ({ memberPermissions, setMemberPermissions, userId, projectId, disabled }: PermissionsList) => {
    const [permissions, setPermissions] = useState([]);

    console.log(disabled);

    const fetchPermissions = async () => {
        try {

            const result = await getPermissions();
            const data = await result.json();

            if (result.ok) {
                setPermissions(data.permissions);

            } else {
                toast.error(data.message || 'Erro ao carregar membros!')
            }

        } catch (err) {
            console.error(err);
            toast.error('Erro ao carregar membros!');
        }

    }

    useEffect(() => {

        fetchPermissions()

    }, [])

    const handleCheckboxChange = (permissionId: number) => {

        const exists = memberPermissions.some(p => p.permission_id === permissionId);

        let updatedPermissions: Permission[];

        if (exists) {

            updatedPermissions = memberPermissions.filter(p => p.permission_id !== permissionId);
        } else {

            const newPermissionObj: Permission = {
                user_id: userId,
                project_id: projectId,
                permission_id: permissionId
            };

            updatedPermissions = [...memberPermissions, newPermissionObj];
        }

        setMemberPermissions(updatedPermissions);
    };

    return (
        <div className="permissions-list">
            <table>
                <tbody>
                    {
                        permissions.map((permission: Permission, index) =>

                            <tr key={index}>
                                <td>{permission?.key}</td>
                                <td><input type="checkbox" checked={memberPermissions.some(p => p.permission_id === permission.id)} onChange={() => permission.id && handleCheckboxChange(permission.id)} disabled={disabled} /></td>
                            </tr>

                        )
                    }
                </tbody>
            </table>
        </div>

    )
}


export default function ProjectMembersPage() {
  return (
    <Suspense fallback={<p className="alert">A carregar...</p>}>
      <ProjectMembers />
    </Suspense>
  );
}