import React, { useState, useEffect } from 'react';
import { List, Card, Button, Modal, Form, Input, DatePicker, Upload } from 'antd';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import RaceListService from '../../services/raceListService';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import Footer from '../../components/footer/Footer';

const HomeAdmin = () => {
  const [races, setRaces] = useState([]);
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [createForm] = Form.useForm();
  const navigate = useNavigate();

  const handleCardClick = (raceId) => {
    navigate(`/racedataAdmin/${raceId}`);
  };

  const showCreateForm = () => {
    setCreateFormVisible(true);
  };

  const handleCreate = async (values) => {
    try {

      // Extraer los datos para el esquema de la carrera
      const raceData = {
        _id: values.name,
        eventDate: values.eventDate,
        city: values.city,
        length: values.length,
      };

      // Extraer los datos para el esquema de la ruta
      const routeData = {
        race: values.name,
        checkpoint: values.checkpoint,
        startPoint: values.startPoint,
        goal: values.goal,
      };

      const statusData = {
        carrera: values.name,
      };

      console.log(file)
      const response = await RaceListService.createRace(file, raceData);
      const response2 = await RaceListService.createRoute(routeData);
      const responseStatus = await RaceListService.createStatus(statusData);
      if (response.success && response2.success) {
        const raceDataWithInfo = {
          _id: values.name,
          eventDate: values.eventDate,
          city: values.city,
          length: values.length,
          route: response2.data._id,
          status: responseStatus.data._id,
        }
        const response3 = await RaceListService.updateRace(values.name, raceDataWithInfo);

        if (response3.success) {
          setRaces([...races, response.data]);
          setCreateFormVisible(false);
          createForm.resetFields();
        }
      } else {
        // Handle error if needed
        console.error("Error creating race:", response.error);
        console.error("Error creating route:", response2.error);
      }
    } catch (error) {
      // Handle error if needed
      console.error("Error creating race:", error);
    }
  };

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await RaceListService.getRaces();
        if (response.success) {
          setRaces(response.data);
        } else {
          // Handle error if needed
          console.error("Error fetching races:", response.error);
        }
      } catch (error) {
        // Handle error if needed
        console.error("Error fetching races:", error);
      }
    };
    fetchRaces();
  }, []);

  return (
    <div>
      <Header />

      <div className="race-list">
        <div className='sup'>
          <Button type="primary" onClick={showCreateForm} className='button-thin' style={{ marginBottom: '16px' }}>
            Create Race
          </Button>
        </div>
        <div className="card-list-container">
          <List
            grid={{ gutter: 16 }}
            dataSource={races}
            renderItem={(race) => (
              <List.Item key={race._id} onClick={() => handleCardClick(race._id)}>
                <Link>
                <Card title={race._id} className='cardP'>
                  <img
                    className='racePicture'
                    src={`http://localhost:3001/images/${race.filename}`}
                    alt={race.filename}
                  />
                </Card>
                </Link>
              </List.Item>
            )}
          />
        </div>
        <Modal
          title="Create Race"
          open={createFormVisible}
          onCancel={() => setCreateFormVisible(false)}
          onOk={createForm.submit}
        >
          <Form form={createForm} onFinish={handleCreate}>
            <Form.Item name="name" label="Race Name" rules={[{ required: true, message: 'Please enter the race name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="eventDate" label="Event Date" rules={[
              { required: true, message: 'Please select the event date' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && value.isAfter(moment(), 'day')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Event date must be in the future'));
                },
              }),
            ]}>
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please enter the city' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="length"
              label="Length"
              rules={[
                { required: true, message: 'Please enter the race length' },
                {
                  type: 'number',
                  transform: (value) => (value ? Number(value) : undefined),
                  message: 'Please enter a valid number for the race length',
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="checkpoint"
              label="Checkpoint"
              rules={[
                { required: true, message: 'Please enter the checkpoint' },
                {
                  type: 'number',
                  transform: (value) => (value ? Number(value) : undefined),
                  message: 'Please enter a valid number for the checkpoint',
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item name="startPoint" label="Start Point" rules={[{ required: true, message: 'Please enter the start point' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="goal" label="Goal" rules={[{ required: true, message: 'Please enter the goal' }]}>
              <Input />
            </Form.Item>
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                setFile(file);

                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Foto</Button>
            </Upload>
          </Form>

        </Modal>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default HomeAdmin;
