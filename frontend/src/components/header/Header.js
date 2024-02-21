import React, { useState } from 'react';
import './Header.css'; // Archivo de estilos CSS personalizado
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'antd'; // Importar el componente Modal de antd
import DemoService from '../../services/demoService';

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedOption, setSelectedOption] = useState(null); // Estado para almacenar la opción seleccionada
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleRedirect = (path) => {
    navigate(path);
  };

  const openModal = () => {
    setModalVisible(true); // Mostrar el modal al hacer clic en el botón "Report"
  };

  const handleModalOk = () => {
    if (selectedOption === "races") {
      window.open('http://localhost:5488/templates/HJH11D83ce', '_blank');
    } else if (selectedOption === "messages") {
      window.open('http://localhost:5488/templates/me0AYIO', '_blank');
    }
    setModalVisible(false); 
  };

  const handleModalCancel = () => {
    setModalVisible(false); // Ocultar el modal si se cancela
  };

  const demoData = async () => {
    try {
      await DemoService.createDemoData();
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

  const logOut = () => {
    // Borrar el token del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Redirigir a la página de inicio de sesión
    navigate('/login');
  };

  const role = localStorage.getItem('role');

  return (
    <div className="header-container">

      <div className={`menu ${menuVisible ? 'show' : ''}`} onClick={toggleMenu}>
        <ul>
          <li>
            <Button
              type="primary"
              className="demo-button"
              onClick={() => handleRedirect(role === 'admin' ? '/homeAdmin' : '/home')}
            >
              Vuelta al inicio
            </Button>
          </li>
          <li>
            <a href='/user-manual/Home.html'>
              <Button
                type="primary"
                className="demo-button"
                onClick={() => handleRedirect('')}
              >
                Manual
              </Button>
            </a>
          </li>
          <li>
            <Button
              type="primary"
              className="demo-button"
              onClick={() => handleRedirect('/usersettings')}
            >
              Ajustes de usuario
            </Button>
          </li>
          <li>
            <Button
              type="primary"
              className="demo-button"
              onClick={openModal} >
              Report
            </Button>
          </li>
          <li>
            <Button
              type="primary"
              className="demo-button"
              onClick={demoData}
            >
              Crear datos demo
            </Button>
          </li>
          <li>
            <Button
              type="primary"
              className="logout-button"
              onClick={logOut}
            >
              Cerrar sesión
            </Button>
          </li>
        </ul>
      </div>
      <div className={`menu-overlay ${menuVisible ? 'show' : ''}`} onClick={toggleMenu}></div>
      <div className="menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>
      <Modal
        title="Reports"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Open"
        cancelText="Cancel" >
        <p>Which report would you like to open?</p>
        <Button onClick={() => setSelectedOption("races")}>Races</Button>
        <Button onClick={() => setSelectedOption("messages")}>Messages</Button>
      </Modal>
    </div>
  );
};

export default Header;
