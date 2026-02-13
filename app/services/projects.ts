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