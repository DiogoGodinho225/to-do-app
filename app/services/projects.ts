import { Project, Task, Subtask } from "../types/next-project";
import { Invite } from "../types/next-invites";

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

export async function getProjects(owner_id: string) {
    const res = await fetch(`/api/projects/getProjects/${owner_id}`, {
        method: 'GET',
    })

    const data = await res.json();

    return data.projects;
}

export async function deleteProject(id: string, userId: number): Promise<Response> {
    const res = await fetch(`/api/projects/delete/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
            userId
        })
    })

    return res;
}

export async function getProject(id: string): Promise<Response> {
    const res = await fetch(`/api/projects/getProject/${id}`, {
        method: 'GET',
    })

    return res;
}

export async function inviteMember(data: Invite): Promise<Response> {
    const res = await fetch('/api/invites/invite-member', {
        method: 'POST',
        body: JSON.stringify({
            data: data
        })
    })

    return res;
}

export async function getMembers(project_id: number): Promise<Response> {
    const res = await fetch(`/api/projects/members/getMembers/${project_id}`, {
        method: 'GET',
    })

    return res;
}

export async function removeMember(userId: number, projectId: number, id: number): Promise<Response> {
    const res = await fetch(`/api/projects/members/${projectId}/remove-member/${userId}`, {
        method: 'DELETE',
        body: JSON.stringify({
            id
        })
    })

    return res;
}

export async function editProject(data: Project, userId:number, projectId:number): Promise<Response> {
    const res = await fetch(`/api/projects/editProject/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({
            data: data,
            userId,
        })
    })

    return res;
}

export async function editTask(data: Task, id: number, userId:number, projectId:number): Promise<Response> {
    const res = await fetch(`/api/projects/tasks/editTask/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            data: data,
            userId,
            projectId
        })
    })

    return res;
}

export async function createTask(data: Task, userId:number, projectId:number): Promise<Response> {
    const res = await fetch(`/api/projects/tasks/createTask`, {
        method: 'POST',
        body: JSON.stringify({
            data: data,
            userId,
            projectId
        })
    })

    return res;
}

export async function removeTask(userId: number, projectId: number, id: number): Promise<Response> {
    const res = await fetch(`/api/projects/tasks/remove-task/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
            userId,
            projectId,
        })
    })

    return res;
}

export async function removeSubtask(userId: number, taskId: number, id: number): Promise<Response> {
    const res = await fetch(`/api/projects/tasks/subtasks/removeSubtask/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
            userId,
            taskId,
        })
    })

    console.log(res)

    return res;
}

export async function createSubtask(data: Subtask, userId:number, taskId:number): Promise<Response> {
    const res = await fetch(`/api/projects/tasks/subtasks/createSubtask`, {
        method: 'POST',
        body: JSON.stringify({
            data: data,
            userId,
            taskId
        })
    })

    return res;
}

export async function editSubtask(data: Subtask, id: number, userId:number, taskId:number): Promise<Response> {
    const res = await fetch(`/api/projects/tasks/subtasks/editSubtask/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            data: data,
            userId,
            taskId
        })
    })

    return res;
}