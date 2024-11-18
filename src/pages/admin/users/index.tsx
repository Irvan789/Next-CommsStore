/* eslint-disable @typescript-eslint/no-explicit-any */
import UsersAdminView from '@/components/views/admin/Users'
import userServices from '@/services/user'
import { useEffect, useState } from 'react'

const AdminUsersPage = ({ setToaster }: any) => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const getAllUsers = async () => {
            const { data } = await userServices.getAllUsers()
            setUsers(data.data)
        }
        getAllUsers()
    }, [])

    return <UsersAdminView users={users} setToaster={setToaster} />
}

export default AdminUsersPage
