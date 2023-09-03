import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { GET_PROJECT } from '../queries/projectQueries'
import { UPDATE_PROJECT } from '../mutations/projectMutation'
import { useNavigate } from 'react-router-dom'



const EditProjectButton = ({ project }) => {
    const [name, setName] = useState(project.name)
    const [description, setDescription] = useState(project.description)
    const [status, setStatus] = useState("")
    const navigate = useNavigate()

    const [updateProject] = useMutation(UPDATE_PROJECT, {
        variables: {id: project.id, name, description, status},
        onCompleted: () => navigate("/"),
        refetchQueries: [{ query: GET_PROJECT, variables: { id: project.id}}]
    })
 
    const onSubmit = (e) => {
        e.preventDefault()
        if(!name || !description || !status) {
            return alert("Please fill the form")
        }

        updateProject(name, description, status)
    }



  return (
    <div className="mt-5">
        <h3>Update Project Detail</h3>
        <form onSubmit={onSubmit} action="">
        <div className="mb-3">
                <label htmlFor="" className="form-label">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
            </div>
            <div className="mb-3">
                <label htmlFor="" className="form-label">description</label>
                <textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" ></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="" className="form-label">Status</label>
                <select name="" id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
                      <option value="new">Not Started</option>
                      <option value="progress">In Progress</option>
                      <option value="completed">Completed</option>
                </select>
            </div>
            <button type='submit'  className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default EditProjectButton