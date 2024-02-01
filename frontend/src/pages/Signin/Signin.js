import React, { useState } from 'react';
import { Input, Button, Switch, Modal, Form } from 'antd';
import './Signin.css'; // Archivo de estilos CSS personalizado
import { useNavigate } from 'react-router-dom';
import signInService from '../../services/signInService'; // Import the provided signInService
import UserService from '../../services/logInService';

import Footer from '../../components/footer/Footer';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    DNI: '',
  });
  const [form2] = Form.useForm();
  const [formData2, setFormData2] = useState({});


  //IMPLEMENTAR CUADRADITO PARA QUE SI QUIERO RECIBIR NOTIFICACIONES


  const navigate = useNavigate();

  const handleSubmit = (e) => {
  // Prevents the default form submission behavior
    if (isCreateCompany) {
      signInService.createCompany(formData, formData2).then(async (data) => {
      
        // You can add a redirect or other logic here

        const response = await UserService.login({ _id: formData.email, password: formData.password });
        // Handle the response as per your requirements
        localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      // Redirect to the home page
      if(localStorage.getItem('role') === 'admin'){
        navigate('/homeAdmin');
      }else{
        navigate('/home');
        }

      }).catch((error) => {
        console.error('Error creating user:', error);
      });
    } else {
      // Call the createUser function from the signInService
      signInService.createUser(formData).then(async (data) => {
        // You can add a redirect or other logic here

        const response = await UserService.login({ _id: formData.email, password: formData.password });
        // Handle the response as per your requirements
        // Save the token to the local storage
        localStorage.setItem('token', response.token);
        // Redirect to the home page
        navigate('/home');

      }).catch((error) => {
        console.error('Error creating user:', error);
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.placeholder]: e.target.value,
    });
  };

  const [isCreateCompany, setIsCreateCompany] = useState(false); // Nuevo estado para controlar la lógica del botón

  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setIsCreateCompany(false);
  };

  const handleSwitchChange = (checked) => {
    const value=checked;
    setIsCreateCompany(value);
  };

  const handleOk = async () => {
    const values=form2.getFieldsValue();
    setIsModalVisible(false);
    setFormData2(values);
  };


  return (
    <div className="signin-container">
      <div className="background-image">
        <img src="/img/couple.jpg" alt="Background" className="bg-img" />
      </div>
      <div className="Signin-form">
        <h2>Bienvenido a la Maratón</h2>
          <Form>
            <Form.Item
              name="email"
              label="Correo electrónico"
              rules={[
                {
                  required: true,
                  message: 'Ingresa tu correo electrónico',
                },
                {
                  type: 'email',
                  message: 'Ingresa un correo electrónico válido',
                },
              ]}
            >
              <Input
                placeholder="email"
                className="input"
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                {
                  required: true,
                  message: 'Ingresa tu contraseña',
                },
              ]}
            >
              <Input.Password
                placeholder="password"
                className="input"
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              name="name"
              label="Nombre"
              rules={[
                {
                  required: true,
                  message: 'Ingresa tu nombre',
                },
              ]}
            >
              <Input
                placeholder="name"
                className="input"
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Teléfono"
              rules={[
                {
                  required: true,
                  message: 'Ingresa tu número de teléfono',
                },
                {
                  pattern: /^\d{9}$/,
                  message: 'El teléfono debe tener 9 dígitos',
                },
              ]}
            >
              <Input
                placeholder="phone"
                className="input"
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              name="DNI"
              label="DNI"
              rules={[
                {
                  required: true,
                  message: 'Ingresa tu DNI',
                },
                {
                  pattern: /^\d{8}[A-Za-z]$/,
                  message: 'Debe tener 8 numeros y 1 letra',
                },
              ]}
            >
              <Input
                placeholder="DNI"
                className="input"
                onChange={handleChange}
              />
            </Form.Item>

            {/* Otras entradas del formulario */}
            <Button type="primary" htmlType="submit" onClick={handleSubmit} className="Signin-button">
              Crear cuenta
            </Button>
            <Button type="primary" className="Signin-button" onClick={showModal}>
              Abrir Modal
            </Button>
          </Form>

          <Modal
            title="Switch para createCompany"
            open={isModalVisible}
            onCancel={handleModalCancel}
            onOk={handleOk}
            footer={[
              <Button key="back" onClick={handleModalCancel}>
                Cancelar
              </Button>,
              <Button key="submit" type="primary" onClick={handleOk}>
                Confirmar
              </Button>,
            ]}
          >
            <p>Selecciona si deseas utilizar createCompany:</p>
            <Switch onChange={handleSwitchChange} />

            <Form form={form2}>
              <Form.Item
                name="_id"
                label="CIF"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, ingresa el CIF',
                  },
                  {
                    pattern: /^[A-HJNP-SUVW][0-9]{8}$/,
                    message: 'El CIF debe tener 9 caracteres alfanuméricos',
                  },
                ]}
              >
                <Input />
              </Form.Item>

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
      </div>
      <Footer></Footer>
    </div>
  );};

export default Signin;

