import React, { useState, useEffect } from 'react';
import { Table, Form, Input, Button, Select } from 'antd';
import UserService from '../../services/userService';
import Header from '../../components/header/Header';
import { useParams } from 'react-router-dom';
import MyButton from '../../components/buttonBack/buttonBack';

const UserCRUD = () => {
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const { id } = useParams();

  const columns = [
    {
      title: 'Email',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'DNI',
      dataIndex: 'DNI',
      key: 'DNI',
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button onClick={() => handleDelete(record._id)}>Delete</Button>
          <Button onClick={() => handleUpdate(record._id)}>Update</Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getUsers();
        const data = response.data;
        if (data) {
          setUsers(data);
        } else {
          console.error('Error fetching users:', response && response.error);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [id]);

  const handleUpdate = async (idUser) => {
    try {
      const values = form.getFieldsValue();
      const updatedUser = { ...values, _id: values.CIF };
      delete updatedUser.CIF;
      await UserService.updateUser(idUser, updatedUser);
      const response = await UserService.getUsers();
      const data = response.data;
      setUsers(data);

      form.resetFields();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (idUser) => {
    try {
      await UserService.deleteUser(idUser);
      const response = await UserService.getUsers();
      const data = response.data;
      setUsers(data);

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  return (

    <div className="page-container">
      <Header />
      <MyButton/>
      <div className='container'>
        <h1>Users</h1>
        <Table dataSource={users} columns={columns} pagination={{ pageSize: 5 }} rowKey="_id" />

        <Form form={form} name="add_user" className="form-container">

          <Form.Item
            name="DNI"
            label="DNI"
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa tu DNI',
              },
              {
                pattern: /^\d{8}[A-Za-z]$/,
                message: 'El DNI debe tener 8 números seguidos de una letra',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="name" label="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="sponsor">Sponsor</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div></div>
  );
};

export default UserCRUD;