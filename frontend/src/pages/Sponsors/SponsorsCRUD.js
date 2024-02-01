import React, { useState, useEffect } from 'react';
import { Table, Form, Input, Button } from 'antd';
import SponsorService from '../../services/sponsorService';
import Header from '../../components/header/Header';
import { useParams } from 'react-router-dom';
import MyButton from '../../components/buttonBack/buttonBack';

const SponsorsCRUD = () => {
    const [sponsors, setSponsors] = useState([]);
    const [form] = Form.useForm();
  
    const columns = [
      {
        title: 'CIF',
        dataIndex: '_id',
        key: '_id',
      },
      {
        title: 'companyName',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: 'typeCompany',
        dataIndex: 'typeCompany',
        key: 'typeCompany',
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
      const fetchSponsors = async () => {
        try {
          const response = await SponsorService.getSponsors();
          const data = response.data;
          if (data) {
            setSponsors(data);
          } else {
            console.error('Error fetching sponsors:', response && response.error);
          }
        } catch (error) {
          console.error('Error fetching sponsors:', error);
        }
      };
    
      fetchSponsors();
    }, []);
  
    const addSponsor = async (values) => {
      const formattedValues = { ...values, _id: values.CIF };
      delete formattedValues.CIF;
      try {
        await SponsorService.addSponsor(formattedValues);
        const response = await SponsorService.getSponsors();
        const data = response.data;
        setSponsors(data);
        
        form.resetFields();
      } catch (error) {
        console.error('Error adding sponsor:', error);
      }
    };
  
    const handleUpdate = async (idSponsor) => {
        try {
            const values = form.getFieldsValue();
            const updatedSponsor = { ...values, _id: values.CIF };
            delete updatedSponsor.CIF;
            await SponsorService.updateSponsor(idSponsor, updatedSponsor);
            const response = await SponsorService.getSponsors();
            const data = response.data;
            setSponsors(data);
            
            form.resetFields();
        } catch (error) {
            console.error('Error updating sponsor:', error);
        }
    };

    const handleDelete = async (idSponsor) => {
        try {
            await SponsorService.deleteSponsorCRUD(idSponsor);
            const response = await SponsorService.getSponsors();
            const data = response.data;
            setSponsors(data);
            
        } catch (error) {
            console.error('Error deleting sponsor:', error);
        }
    };


    return (
      
        <div>
          <Header/>
          <MyButton/>
          <div className="container">
          <h1>Sponsors</h1>
          <Table dataSource={sponsors} columns={columns} pagination={{ pageSize: 5 }}  rowKey="_id" />
    
          <Form form={form} name="add_sponsor" className="form-container" onFinish={addSponsor}>
    
            <Form.Item name="companyName" label="companyName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
    
            <Form.Item name="typeCompany" label="typeCompany" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
    
          </Form>
        </div></div>
      );
    };

    export default SponsorsCRUD;