'use client';
import { FaTrashAlt } from "react-icons/fa";

const MyProjectsPage = () => {
    return (
        <div className="projects-container">
            <h2>Meus Projetos</h2>
            <div className="projects-list">
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </div>
        </div>
    );
}


const ProjectCard = () =>{
    return (
        <div onClick={() => alert('abrir projeto')} className="project-card">
            <h3>Projeto 1</h3>
            <p>Descrição do projeto 1 Descrição do projeto  Descrição do projeto  Descrição do projeto  Descrição do projeto  Descrição do projeto  Descrição do projeto  Descrição do projeto  Descrição do projeto Descrição do projeto  </p>
            <button  type='button' onClick={(e) => {alert('eliminar projeto'); e.stopPropagation()}} className="delete-button"><FaTrashAlt /></button>
        </div>
    );
}

export default MyProjectsPage;