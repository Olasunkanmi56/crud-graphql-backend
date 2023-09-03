import React, { useState } from 'react'
import { FaList } from 'react-icons/fa'
import { GET_CLIENTS } from '../queries/clientQueries'
import { ADD_PROJECT } from '../mutations/projectMutation'
import { useQuery } from '@apollo/client'
import Spinner from './Spinner'
import { useMutation } from '@apollo/client'
import { GET_PROJECTS } from '../queries/projectQueries'

const addProjectModal = () => {
    
    const [name, setname] = useState('')
    const [description, setDescription] = useState('')
    const [clientId, setClientId] = useState('')
    const [status, setStatus] = useState("new")
    const { loading, error, data} = useQuery(GET_CLIENTS)
    const [addProject] = useMutation(ADD_PROJECT, {
        variables: { name, description, clientId, status},
        update(cache, {data: {addProject}}) {
            const { projects} = cache.readQuery({
                query: GET_PROJECTS
            });
            cache.writeQuery({
                query: GET_PROJECTS,
                data: { projects: [...projects, addProject] }
            })
        }
    })
      
    const onSubmit = (e) => {
        e.preventDefault()
        if(name === "" || description === "" || status === "") {
               return alert("please fill the form")
        }

        addProject(name,clientId, description, status)

        setDescription("")
        setname("")
        setStatus("new")
    }


    if(loading) return <Spinner />
    if(error) return <p>Something went wrong...</p>
  return (
    <>
     {!loading && !error && (
          <>
            <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addProjectModal">
   <div className="d-flex align-items-center">
      <FaList className='icon' />
      <div>Add Project</div>
   </div>
</button>

<div className="modal fade" id="addProjectModal"  aria-labelledby="addProjectModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="addProjectModalLabel">New Project</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form onSubmit={onSubmit} action="">
            <div className="mb-3">
                <label htmlFor="" className="form-label">Name</label>
                <input type="text" value={name} onChange={(e) => setname(e.target.value)} className="form-control" />
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
            <div className="mb-3">
                <div className="form-label">
                    <label htmlFor="" className="form-label"></label>
                    <select value={clientId} onChange={(e) => setClientId(e.target.value)} id='client' className="form-select">
                       <option value="">Select Client</option>
                       {data.clients.map(client => (
                          <option key={client.id}  value={client.id}>{client.name}</option>
                       ))}   
                    </select>
                </div>
            </div>
            <button type='submit' data-bs-dismiss="modal" className="btn btn-primary">Submit</button>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
          </>
     )}

    </>
  )
}

export default addProjectModal