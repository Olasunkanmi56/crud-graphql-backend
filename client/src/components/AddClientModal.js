import React, { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useMutation } from '@apollo/client'
import { ADD_CLIENT } from '../mutations/clientMutations'
import { GET_CLIENTS } from '../queries/clientQueries'

const AddClientModal = () => {
 
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [phone, setphone] = useState('')

    const [addClient] = useMutation(ADD_CLIENT, {
        variables: {name, email, phone},
        update(cache, {data: {addClient}}) {
            const { clients} = cache.readQuery({
                query: GET_CLIENTS
            });
            cache.writeQuery({
                query: GET_CLIENTS,
                data: { clients: [...clients, addClient] }
            })
        }
    })
    const onSubmit = (e) => {
        e.preventDefault()
        if(name === "" || email === "" || phone === "") {
               return alert("please fill the form")
        }

        addClient(name, email, phone)

        setemail("")
        setname("")
        setphone("")
    }
  return (
    <>
     
<button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addClientModal">
   <div className="d-flex align-items-center">
      <FaUser className='icon' />
      <div>Add client</div>
   </div>
</button>

<div className="modal fade" id="addClientModal"  aria-labelledby="addClientModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="addClientModalLabel">Add client</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form onSubmit={onSubmit} action="">
            <div className="mb-3">
                <label htmlFor="" className="form-label">Name</label>
                <input type="text" value={name} onChange={(e) => setname(e.target.value)} className="form-control" />
            </div>
            <div className="mb-3">
                <label htmlFor="" className="form-label">Email</label>
                <input type="email" value={email} onChange={(e) => setemail(e.target.value)} className="form-control" />
            </div>
            <div className="mb-3">
                <label htmlFor="" className="form-label">Phone</label>
                <input type="text" value={phone} onChange={(e) => setphone(e.target.value)} className="form-control" />
            </div>
            <button type='submit' data-bs-dismiss="modal" className="btn btn-secondary">Submit</button>
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
  )
}

export default AddClientModal