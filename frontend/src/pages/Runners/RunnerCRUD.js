import React, { useState, useEffect } from 'react';
import { Table, Form, Input, Button } from 'antd';
import RunnerService from '../../services/runnerService';
import Header from '../../components/header/Header';
import { useParams } from 'react-router-dom';
import MyButton from '../../components/buttonBack/buttonBack';

const RunnersCRUD = () => {
  const [runners, setRunners] = useState([]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'DNI',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
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
    const fetchRunners = async () => {
      try {
        const response = await RunnerService.getRunners();
        const data = response.data;
        if (data) {
          setRunners(data);
        } else {
          console.error('Error fetching runners:', response && response.error);
        }
      } catch (error) {
        console.error('Error fetching runners:', error);
      }
    };

    fetchRunners();
  }, []);

  const addRunner = async (values) => {
    const formattedValues = { ...values, _id: values.DNI };
    delete formattedValues.DNI;
    try {
      await RunnerService.addRunner(formattedValues);
      const response = await RunnerService.getRunners();
      const data = response.data;
      setRunners(data);

      form.resetFields();
    } catch (error) {
      console.error('Error adding runner:', error);
    }
  };

  const handleUpdate = async (idRunner) => {
    try {
      const values = form.getFieldsValue();
      const updatedRunner = { ...values, _id: values.DNI };
      delete updatedRunner.DNI;
      await RunnerService.updateRunner(idRunner, updatedRunner);
      const response = await RunnerService.getRunners();
      const data = response.data;
      setRunners(data);

      form.resetFields();
    } catch (error) {
      console.error('Error updating runner:', error);
    }
  };

  const handleDelete = async (idRunner) => {
    try {
      await RunnerService.deleteRunner(idRunner);
      const response = await RunnerService.getRunners();
      const data = response.data;
      setRunners(data);

    } catch (error) {
      console.error('Error deleting runner:', error);
    }
  };


  return (

    <div className="page-container">
      <Header />
      <MyButton/>
      <div className='container'>
        <h1>Runners</h1>
        <Table dataSource={runners} pagination={{ pageSize: 5 }} columns={columns} rowKey="_id" />

        <Form form={form} name="add_runner" className="form-container" onFinish={addRunner}>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[
            { required: true, message: 'Please enter your phone number' },
            {
              pattern: /^[0-9]{9}$/, // Expresión regular para validar un número de teléfono de 10 dígitos
              message: 'Please enter a valid 9-digit phone number',
            },
          ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="details" label="Details">
            <Input.TextArea />
          </Form.Item>

        </Form>
      </div>
    </div>
  );
};

export default RunnersCRUD;