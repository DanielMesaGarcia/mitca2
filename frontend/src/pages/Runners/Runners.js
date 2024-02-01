import React, { useState, useEffect } from 'react';
import { Table, Form, Input, Button } from 'antd';
import RunnerService from '../../services/runnerService';
import Header from '../../components/header/Header';
import { useParams } from 'react-router-dom';
import { Transfer } from 'antd';
import MyButton from '../../components/buttonBack/buttonBack';



const RunnersPage = () => {
  const [runners, setRunners] = useState([]);
  const [userRunners, setUserRunners] = useState([]);
  const { id } = useParams();
  const token = localStorage.getItem('token');

  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [runnerBuffer, setRunnerBuffer] = useState([]);
  const [starter, setStarter] = useState([]);

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
  ];

 
  useEffect(() => {
    const fetchRunners = async () => {
      try {
        const response = await RunnerService.getDataById(id);
        const userResponse = await RunnerService.getUserByToken(token);
        const data = response.data.runners;
        const userData = userResponse.data.runners;
        if (data && userData) {
          setRunners(data);
          setUserRunners(userData);

          // Calcular initialTargetKeys
          const initialTargetKeys = userData
            .filter((userRunner) => data.some((runner) => runner._id === userRunner._id))
            .map((userRunner) => userRunner._id);

          // Establecer initialTargetKeys como datos iniciales para targetKeys
          setTargetKeys(initialTargetKeys);
          setRunnerBuffer(initialTargetKeys);
          setStarter(initialTargetKeys);
          
        } else {
          console.error('Error fetching runners:', response && response.error);
        }
      } catch (error) {
        console.error('Error fetching runners:', error);
      }
    };

    fetchRunners();
  }, [id, token]);

  
  

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  
    if (direction === 'right') {
      // Mover a la derecha, añadir al buffer
      setRunnerBuffer((prevBuffer) => [...prevBuffer, ...moveKeys]);
    } else if (direction === 'left') {
      // Mover a la izquierda, eliminar del buffer
      setRunnerBuffer((prevBuffer) => prevBuffer.filter((id) => !moveKeys.includes(id)));
    }
  };
  
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  



  const mockData = userRunners.map((item) => ({
    key: item._id,
    title: `${item.name} - ${item._id}`,
  }));


  const updateTransfer = async () =>{
    try{
      const updatedRaceData = await RunnerService.transferRunners(runnerBuffer,starter, id);
      setRunners(updatedRaceData.data.runners);
    }catch (error) {
      console.error(error);
    }
  }


  return (

    <div className="page-container">
      <Header />
        <MyButton/>
      <div className='container'>
      <h1>Runners</h1>
      <Table dataSource={runners} pagination={{ pageSize: 5 }}  columns={columns} rowKey="_id" />
      <Transfer
        dataSource={mockData}
        titles={['Source', 'Target']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={onChange}
        onSelectChange={onSelectChange}
        render={(item) => item.title}
      />
      <Button type="primary" onClick={updateTransfer}>Actualizar</Button>
    </div>
    </div>
  );
};

export default RunnersPage;
