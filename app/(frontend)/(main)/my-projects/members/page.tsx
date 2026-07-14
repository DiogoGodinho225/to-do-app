'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getMembers } from "@/app/services/projects"
import toast from "react-hot-toast"
import {Member} from "@/app/types/next-project"

interface MembersListProps {
    members: Member[]; 
}

const ProjectMembers = () => {
    

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

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
        <div className="members-container">
            <h2>Membros</h2>
            <button className="btn-invite">Convidar Membros</button>
            {
                loading ? <p className="alert">A carregar...</p>
                    : members.length === 0 ?
                        <p className="alert">Sem membros</p>
                        :
                        <MembersList members={members}/>
            }

        </div>
    )
}


const MembersList = ({members}: MembersListProps) => {
    return (
        <div className="members-list">
            {
                members.map((member)=>
                    <MemberItem key={member.user.id} member={member}/>
                )
            }

        </div>
    )
}

const MemberItem = ({member}:any) => {

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

    const handleRemoveMember = async (userId: number) =>{
            
    }


    return (

        <div className="member-item">
            <img src={member.user.image_url || "/user.png"}></img>
            <h3>{member.user.first_name}</h3>
            <div className="info">
                <p>Função: {member.role.role}</p>
                {
                    member.user.status == 1 ? <p style={{backgroundColor: 'rgb(96, 213, 96)'}}>Online</p> : <p style={{backgroundColor: 'rgb(241, 38, 38)'}}>{calculateTime(member.user.last_login)}</p>
                }
                {member.role_id != 1 ? <button className="btn-remove" onClick={() => handleRemoveMember(member.user.id)}>Remover</button> : null}
                
            </div>
        </div>
    )
}
export default ProjectMembers;