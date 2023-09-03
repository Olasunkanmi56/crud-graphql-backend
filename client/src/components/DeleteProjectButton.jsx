import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { GET_PROJECTS } from '../queries/projectQueries'
import { useMutation } from '@apollo/client'
import { DELETE_PROJECT } from '../mutations/projectMutation'


const DeleteProjectButton = ({projectId}) => {
    const navigate = useNavigate()
    const [deleteProject] = useMutation(DELETE_PROJECT, {
        variables: { id: projectId},
        onCompleted: () => navigate("/"),
        refetchQueries: [{query: GET_PROJECTS}]
    });
  return (
     <div className="d-flex justify-content-start mt-5 ">
         <div className="btn btn-danger m-2" onClick={deleteProject} >
              <FaTrash  className='icon'/>
         </div>
     </div>
  )
}

export default DeleteProjectButton