import { Project } from "../types/next-project";

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