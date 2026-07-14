import { Project } from "../types/next-project";
import {Invite} from "../types/next-invites";

export async function createProject(data: Project): Promise<Response> {
    const res = await fetch('/api/projects/create', {
        method: 'POST',
        body: JSON.stringify({
            owner_id: data.owner_id,
            title: data.title,
            description: data.description,
        })
    })
    
    return res;
}

export async function getProjects(owner_id : string){
    const res = await fetch(`/api/projects/getProjects/${owner_id}`,{
        method: 'GET',
    })

    const data = await res.json();

    return data.projects;
}

export async function deleteProject(id: string): Promise<Response>{
    const res = await fetch(`/api/projects/delete/${id}`,{
        method: 'DELETE',
    })

    return res;
}

export async function getProject(id: string): Promise<Response>{
    const res = await fetch(`/api/projects/getProject/${id}`,{
        method:'GET',
    })

    return res;
}

export async function inviteMember(data: Invite): Promise<Response>{
    const res = await fetch('/api/projects/invite-member',{
        method: 'POST',
        body: JSON.stringify({
            data: data
        })
    })

    return res;
} 

export async function getMembers(project_id: number): Promise<Response>{
    const res = await fetch(`/api/projects/getMembers/${project_id}`,{
        method: 'GET',
    })

    return res;
} 

export async function removerMember(userId: number, projectId:number): Promise<Response>{
    const res = await fetch(`/api/projects/${projectId}remove-member/${userId}`,{
        method: 'DELETE',
    })

    return res;
}