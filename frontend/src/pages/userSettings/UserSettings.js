import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, Modal } from 'antd';
import './UserSettings.css';
import Header from '../../components/header/Header';
import UserService from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import { regSw,
  subscribe,
  unregisterAllServiceWorkers,
  checkIfAlreadySubscribed,
  getAllSubscriptions,
  sendNotificationToSubscriptionName,
  unregisterFromServiceWorker } from '../../services/helper';
import MyButton from '../../components/buttonBack/buttonBack';

const UserSettings = () => {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [formDisabled, setFormDisabled] = useState(true); // Estado para controlar si los inputs están deshabilitados
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getUserByToken(token);
        const data = response.data;
        if (data) {
          setUserData(data);
          form.setFieldsValue({
            _id: data._id,
            DNI: data.DNI,
            name: data.name,
            phone: data.phone,
            // Agrega más campos según sea necesario
          });
          if (data.role === 'sponsor') {
            setCompanyData(data.sponsor);
            form2.setFieldsValue({
              _id: data.sponsor._id,
              companyName: data.sponsor.companyName,
              typeCompany: data.sponsor.typeCompany,
              // Agrega más campos según sea necesario
            });
          }
        } else {
          console.error('Error fetching users:', response && response.error);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  const registerAndSubscribe = async () => {
    try {
      const serviceWorkerReg = await regSw();
      const recipient =await subscribe(serviceWorkerReg, subscriptionName);

      setSubscribed(true);
      getAllSubscriptions().then((res) => {
        setSubscriptions(res.data);
      });
      setSelectedRecipient(recipient);
    } catch (error) {
      console.log(error);
    }
  }

  const [subscribed, setSubscribed] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionName, setSubscriptionName] = useState("Carreras");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("select a recipient");

  

  const checkSubscriptionState = async () => {
    const subscriptionState = await checkIfAlreadySubscribed();
    setSubscribed(subscriptionState);
  }

  const handleSubscription = async (e) => {
    e.preventDefault();

    await registerAndSubscribe();
  }

  const handleUnsubscription = (e) => {
    e.preventDefault();

    unregisterFromServiceWorker().then(() => {
      checkSubscriptionState();
    })
  }


  useEffect(() => {
    checkSubscriptionState();
    
    getAllSubscriptions().then((res) => {
      setSubscriptions(res.data);
    });
    setSubscriptionName("Carreras");
    setNotificationMessage("Tu suscripción ha sido iniciada");
  }, []);

  useEffect(() => {
    getAllSubscriptions().then((res) => {
      setSubscriptions(res.data);
    });
    
  }, [subscribed]);

  const handleButtonClick = (path) => {
    // Call navigate when the button is clicked
    navigate(path);

    // Optionally, close the modal if needed
    // handleCancel2();
  };


  const handleFormSubmit = async () => {
    const values = form.getFieldsValue();
    UserService.updateUser(values._id, values);
    setFormDisabled(true);
  };

  const handleSwitchChange = (checked) => {
    setFormDisabled(!checked);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [form2] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showModal2 = () => {
    setIsModalVisible2(true);
  };

  const handleOk = async () => {
    const values = form2.getFieldsValue();
    UserService.updateSponsor(userData.sponsor._id, values);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };

  // Puedes usar useEffect para actualizar el formulario cuando userData cambia
  useEffect(() => {
    form.setFieldsValue({
      _id: userData._id,
      companyName: userData.companyName,
      typeCompany: userData.typeCompany,
    });
  }, [userData, form]);


  const goToRunners = () => {
    navigate('/runnersuser');
  }
  return (
    <>
      <Header />
      <MyButton/>

      <div className="account-settings-container">
        <Switch
          checked={!formDisabled}
          onChange={handleSwitchChange}
        />

        <Form
          form={form}
          name="account-settings"
          onFinish={handleFormSubmit}
        >
          <p>{userData._id}</p>

          <Form.Item label="Nombre" name="name">
            <Input disabled={formDisabled} />
          </Form.Item>
          <Form.Item label="Telefono" name="phone">
            <Input disabled={formDisabled} />
          </Form.Item>

          {/* ... (más elementos Form.Item según sea necesario) */}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar cambios
            </Button>
          </Form.Item>
        </Form>

        <div className="buttons-container">
          {userData.role === 'user' && (
            <Button onClick={goToRunners}>
              Gestionar corredores
            </Button>
          )}

          {userData.role === 'sponsor' && (
            <Button onClick={showModal}>
              Gestionar patrocinador
            </Button>
          )}

          {userData.role === 'admin' && (
            <Button onClick={showModal2}>
              Gestionar tablas
            </Button>
          )}
        </div>


        <Modal
          title="Título del Modal"
          open={isModalVisible2}
          onCancel={handleCancel2}

        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="primary" onClick={() => handleButtonClick('/users')}>Usuarios</Button>
            <Button type="primary" onClick={() => handleButtonClick('/runners')}>Corredores</Button>
            <Button type="primary" onClick={() => handleButtonClick('/sponsors')}>Patrocinadores</Button>
          </div>
        </Modal>


        <Modal
          title="Tu empresa"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            form={form2}
            onFinish={handleOk}
          // Agrega otros props necesarios para tu formulario
          >
            <p>{companyData._id}</p>

            <Form.Item
              name="companyName"
              label="Nombre de la empresa"
              rules={[
                {
                  required: true,
                  message: 'Por favor, ingresa el nombre de la empresa',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="typeCompany"
              label="Tipo de empresa"
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecciona el tipo de empresa',
                },
              ]}
            >
              <Input />
            </Form.Item>

          </Form>
        </Modal>
        <Button type="primary" onClick={handleSubscription} style={{ marginTop: '16px',marginRight: '16px' }}>
          Suscribirme
        </Button>
        <Button type="primary" onClick={handleUnsubscription} style={{ marginBottom: '16px' }}>
          Desuscribirme
        </Button>
      </div>
    </>
  );
};

export default UserSettings;
