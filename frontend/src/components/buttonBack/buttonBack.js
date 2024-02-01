import React from 'react';
import { Button } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const MyButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const handleButtonClick = () => {
    // Implementa un sistema switch basado en la ruta actual
    if(localStorage.getItem('role') === 'admin'){
    switch (location.pathname) {
      case `/runners/${id}`:
      case `/sponsors/${id}`:
        
        // Ir a la ruta de racedata/:id
        navigate(`/racedataAdmin/${id}`);
        break;
      case `/racedataAdmin/${id}`:
        // Ir a la ruta de /home
        navigate('/homeAdmin');
        break;
      case '/userSettings':
        // Ir a la ruta de /home
        navigate('/homeAdmin');
        break;
        case `/runners`:
        case `/sponsors`:
        case `/users`:
          navigate('/userSettings');
          break;
      // Agrega más casos según sea necesario
      default:
        // Ir a una ruta predeterminada si no se encuentra ninguna coincidencia
        navigate('/homeAdmin');
        break;
    }
  }else{
    switch (location.pathname) {
      case `/runners/${id}`:
      case `/sponsors/${id}`:
        
        // Ir a la ruta de racedata/:id
        navigate(`/racedata/${id}`);
        break;
      case `/racedata/${id}`:
        // Ir a la ruta de /home
        navigate('/home');
        break;
      case '/userSettings':
        // Ir a la ruta de /home
        navigate('/home');
        break;
        case `/runners`:
        case `/sponsors`:
        case `/users`:
          navigate('/userSettings');
          break;
      // Agrega más casos según sea necesario
      default:
        // Ir a una ruta predeterminada si no se encuentra ninguna coincidencia
        navigate('/home');
        break;
    }
  }
  };

  return (
    <Button type="primary" onClick={handleButtonClick} style={{ margin: '8px' }}>
      Volver atrás
    </Button>
  );
};

export default MyButton;
