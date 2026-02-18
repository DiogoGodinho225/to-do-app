'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProjects } from '../services/projects';
import { useSession } from 'next-auth/react';

interface ProjectsContextType {
    projects: any[];
    loading: boolean;
    error: string;
    fetchProjects: any;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { data: session } = useSession();

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const ownerId = session?.user?.id?.toString();
            if (ownerId) {
                setProjects(await getProjects(ownerId));
            }

        } catch (err) {
            console.error(err);
            setError('Erro ao procurar os projetos!')
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (session) {
            fetchProjects();
        }

    }, [session?.user]);

    return (
        <ProjectsContext.Provider value={{ projects, error, loading, fetchProjects } as ProjectsContextType}>
            {children}
        </ProjectsContext.Provider>
    );


}

export function useProjects() {
    const context = useContext(ProjectsContext);
    if (!context) throw new Error("Erro no Provider!");
    return context;
}