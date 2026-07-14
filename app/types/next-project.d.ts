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
    }
}