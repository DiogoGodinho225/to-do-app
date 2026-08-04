export type Project = {
    id?: number,
    owner_id?: number,
    title: string,
    description?: string,
    tasks?: Task[],
    project_members?: Member[];
}

export type Member = {
    id?: number,
    project_id: number,
    user_id: number,
    role_id: number,
    user:{
        id: number
        member_permissions: Permission[],
        first_name: string,
        last_name: string,
    }
}

export type Permission = {
    id?: number,
    project_id: number,
    user_id: number,
    permission_id: number,
    key?: string,
}

export type Task ={
    id?: number
    title?: string,
    priority_id?: number,
    project_id?: number,
    user_id?: number,
    description?: string,
    user?:{
        first_name: string,
        last_name: string,
    },
    priority?:{
        status: string,
    }
    dueDate?: string,
    status?:{
        status: string,
    },
    status_id?: number,
    subtasks?: Subtask[]
}

export type Subtask = {
    id?: number,
    task_id?: number
    title?: string,
    description?: string,
    status: number,
}