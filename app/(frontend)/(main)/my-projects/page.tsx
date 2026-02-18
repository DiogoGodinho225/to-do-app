'use client';
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import Modal from '@/app/(frontend)/components/model';
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { createProject, deleteProject } from "@/app/services/projects";
import { useRouter } from "next/navigation";
import { useProjects } from "@/app/context/ProjectsContext";

const MyProjectsPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();
    const { projects, error, loading } = useProjects();

    const handleModalStatus = () => {
        setIsModalOpen(!isModalOpen);
    }

    useEffect(() => {
        if (error != '') {
            toast.error(error);
        }
    }, [error])

    return (
        <>
            {isModalOpen ?
                <Modal handleStatus={handleModalStatus} title={'Novo Projeto'}>
                    <CreateForm owner_id={Number(session?.user.id)} handleModalStatus={handleModalStatus} />
                </Modal>
                : null
            }

            <div className="projects-container">
                <h2>Meus Projetos</h2>
                <button onClick={handleModalStatus} className="add-button"><FaPlus /> Projeto</button>
                {
                    loading ? <p className="alert">A carregar Projetos...</p> : projects.length > 0 ?
                        <div className="projects-list">
                            {
                                projects.map((project, index) => (
                                    <ProjectCard key={index} project={project} />
                                ))
                            }
                        </div>
                        : <p className="alert">Sem Projetos criados!</p>
                }

            </div>
        </>
    );

}


const ProjectCard = ({ project }: any) => {

    const {fetchProjects} = useProjects();
    const router = useRouter();

    const handleDeleteProject = async () => {

        const confirmDelete = window.confirm("Tens a certeza que queres eliminar este projeto?");

        if (!confirmDelete) return;

        try {
            const result = await deleteProject(project.id);
            const body = await result.json();

            if (result.ok) {
                toast.success(body.message);
                fetchProjects();
            } else {
                toast.error(body.message);
            }


        } catch (error) {
            toast.error('Erro ao eliminar projeto!')
            console.error(error);
        }

    }

    return (
        <div onClick={() => router.push(`/my-projects/view?id=${project.id}`)} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description || 'Adicione uma descrição a este Projeto...'}</p>
            <button type='button' onClick={(e) => { handleDeleteProject(); e.stopPropagation() }} className="delete-button"><FaTrashAlt /></button>
        </div>
    );
}


const CreateForm = ({ owner_id, handleModalStatus }: { owner_id: number, handleModalStatus: any }) => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const newProject = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { title, description } = e.currentTarget.elements as any;

        const data = { title: title.value, description: description.value, owner_id }
        setLoading(true);

        try {
            const result = await createProject(data);
            const body = await result.json();

            if (result.ok) {
                toast.success(body.message);
                handleModalStatus();
                router.push('/projects/view');
            } else {
                toast.error(body.message);
            }


        } catch (error) {
            toast.error('Erro  criar projeto!')
            console.error(error);
        } finally {
            setLoading(false);
        }


    }

    return (
        <form onSubmit={newProject}>
            <div className="form-group">
                <label htmlFor="title">Título</label>
                <input type="text" name="title" placeholder="Título" required />
            </div>
            <div className="form-group">
                <label htmlFor="description">Título</label>
                <textarea rows={8} name="description" placeholder="Descrição"></textarea>
            </div>
            <button type="submit">{!loading ? 'Criar' : 'A criar...'}</button>
        </form>
    );

}


export default MyProjectsPage;