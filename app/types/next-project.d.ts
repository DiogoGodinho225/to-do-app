export type Project = {
    owner_id: number,
    title: string,
    description: string,
}

export type Member = {
    project_id: number,
    user_id: number,
    role_id: number,
    user:{
        id: number
        member_permissions: [],
    }
}

export type Permission = {
    id?: number,
    project_id: number,
    user_id: number,
    permission_id: number,
    key?: string,
}