'use client';
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { useState } from "react";
import Modal from '@/app/(frontend)/components/model';
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { createProject } from "@/app/services/projects";
import { useRouter } from "next/router";

const MyProjectsPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const {data: session} = useSession();

    const handleModalStatus = () => {
        setIsModalOpen(!isModalOpen);
    }

    return (
        <>
            {isModalOpen ?
                <Modal handleStatus={handleModalStatus} title={'Novo Projeto'}>
                    <CreateForm owner_id={Number(session?.user.id)} handleModalStatus={handleModalStatus}/>
                </Modal>
                : null
            }

            <div className="projects-container">
                <h2>Meus Projetos</h2>
                <button onClick={handleModalStatus} className="add-button"><FaPlus /> Projeto</button>
                <div className="projects-list">
                    <ProjectCard />
                    <ProjectCard />
                    <ProjectCard />
                    <ProjectCard />
                </div>
            </div>
        </>
    );

}


const ProjectCard = () => {
    return (
        <div onClick={() => alert('abrir projeto')} className="project-card">
            <h3>Projeto 1</h3>
            <p>Descrição do projeto 1 Descrição do projeto  Descrição do projeto  Descrição do projeto  Descrição do projeto  Descrição do projeto  Descrição do projeto  Descrição do projeto  Descrição do projeto Descrição do projeto  </p>
            <button type='button' onClick={(e) => { alert('eliminar projeto'); e.stopPropagation() }} className="delete-button"><FaTrashAlt /></button>
        </div>
    );
}


const CreateForm = ({owner_id, handleModalStatus}:{owner_id:number, handleModalStatus:any} ) => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const newProject = async (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {title, description} = e.currentTarget.elements as any;

        const data = {title: title.value, description: description.value, owner_id}
        setLoading(true);

        try {
            const result = await createProject(data);
            const body = await result.json();
           
            if(result.ok){
                toast.success(body.message);
                handleModalStatus();
                router.push('/projects/view');
            }else{
                toast.error(body.message);
            }
            
            
        } catch (error) {
            toast.error('Erro  criar projeto!')
            console.error(error);
        }finally{
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