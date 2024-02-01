import React, { useEffect, useState } from 'react';
import { Card, Button, TimePicker, Checkbox, Select } from 'antd';
import Header from '../../components/header/Header';
import './RaceData.css';
import RaceDataService from '../../services/raceDataService';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Form from 'antd/es/form/Form';
import Modal from 'antd/es/modal/Modal';
import {
  checkIfAlreadySubscribed,
  getAllSubscriptions,
  sendNotificationToSubscriptionName
} from '../../services/helper';
import MyButton from '../../components/buttonBack/buttonBack';
import CardComponent from '../../components/cards/cards';
const { Option } = Select;
dayjs.extend(customParseFormat);



const RaceDataAdmin = () => {
  const [Data, setData] = useState(null);
  const { id } = useParams();
  const selectedRaceId = id;
  const navigate = useNavigate();


  const handleRunnerClick = () => {
    navigate(`/runners/${id}`);
  };

  const handleSponsorClick = () => {
    navigate(`/sponsors/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RaceDataService.getDataById(selectedRaceId);
        const data = response.data;
        if (data) {
          setData(data);
        }
      } catch (error) {
        console.error('Error fetching route data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (idRace) => {
    try {
      await RaceDataService.deleteRace(idRace);
      navigate(`/homeAdmin`);
    } catch (error) {
      console.error('Error deleting runner:', error);
    }
  };

  const [endingFormVisible, setEndingFormVisible] = useState(false);
  const [startingFormVisible, setStartingFormVisible] = useState(false);
  const [endingForm] = Form.useForm();
  const [startingForm] = Form.useForm();
  const [time, setTime] = useState();

  const showForm = () => {
    if (Data.status.statusAtTheMoment === 'No empezada') {
      setStartingFormVisible(true);
    } else {
      setEndingFormVisible(true);
    }

  };

  useEffect(() => {
    checkSubscriptionState();

    getAllSubscriptions().then((res) => {
      setSubscriptions(res.data);
    });
    setSubscriptionName("Carreras");
    setNotificationMessage("¡La carrera " + selectedRaceId + " ha empezado!");
  }, []);

  const handleStart = async () => {

    try {
      setNotificationMessage("La carrera " + selectedRaceId + " ha empezado");
      await sendNotificationToSubscriptionName(selectedRecipient, notificationMessage);

      // Extraer los datos para el esquema de la carrera
      const statusData = {
        statusAtTheMoment: 'En curso',
      };

      const response = await RaceDataService.updateStatus(Data.status._id, statusData);
      if (response.success) {
        setData({ ...Data, status: response.data });
        setStartingFormVisible(false);
      } else {
        // Handle error if needed
        console.error("Error updating Status:", response.error);
      }
    } catch (error) {
      // Handle error if needed
      console.error("Error updating Status:", error);
    }
  };

  const handleEnding = async (values) => {
    try {
      values.duration = time;
      const { winner, duration } = values;

      const statusData = {
        statusAtTheMoment: 'Finalizada',
        winner,
        duration,
      };

      const response = await RaceDataService.updateStatus(Data.status._id, statusData);
      if (response.success) {
        setData({ ...Data, status: response.data });
        setEndingFormVisible(false);
      } else {
        // Handle error if needed
        console.error("Error updating Status:", response.error);
      }
    } catch (error) {
      // Handle error if needed
      console.error("Error updating Status:", error);
    }
  };

  const [subscribed, setSubscribed] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionName, setSubscriptionName] = useState("Carreras");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("select a recipient");



  const checkSubscriptionState = async () => {
    const subscriptionState = await checkIfAlreadySubscribed();
    setSubscribed(subscriptionState);
  }






  useEffect(() => {
    getAllSubscriptions().then((res) => {
      setSubscriptions(res.data);
    });

  }, [subscribed]);


const msg = new SpeechSynthesisUtterance();

const speechHandler = () => {
  let textToSpeak;

  if (Data.status.statusAtTheMoment !== 'No empezada' && Data.status.statusAtTheMoment !== 'En curso') {
    textToSpeak = 'Puntos de control: ' + Data.route.checkpoint + ', Lugar de inicio: ' + Data.route.startPoint + ', Meta: ' + Data.route.goal + ', Estado actual: ' + Data.status.statusAtTheMoment + ', Ganador:' + Data.status.winner + ', Duracion: ' + Data.status.duration;
  } else {
    textToSpeak = 'Puntos de control: ' + Data.route.checkpoint + ', Lugar de inicio: ' + Data.route.startPoint + ', Meta: ' + Data.route.goal + ', Estado actual: ' + Data.status.statusAtTheMoment;
  }


  msg.text = textToSpeak;
  window.speechSynthesis.speak(msg);
};


  return (
    <div>
      <Header />
      <MyButton/>
      <div className='container'>

        <h2>Datos de {selectedRaceId}:</h2>

        <Card className='Route'>
          {Data && (
            <div>
              <p>Puntos de control: {Data.route.checkpoint}</p>
              <p>Lugar de inicio: {Data.route.startPoint}</p>
              <p>Meta: {Data.route.goal}</p>
              <p />
              <p>Estado actual: {Data.status.statusAtTheMoment}</p>
              {Data.status.statusAtTheMoment !== 'No empezada' && Data.status.statusAtTheMoment !== 'En curso' && (
                <div>
                  <p>Ganador: {Data.status.winner}</p>
                  <p>Duración: {Data.status.duration}</p>
                </div>
              )}

              <Button type="primary" onClick={speechHandler}>LEER DATOS</Button>
              <Button type="primary" id='eee' onClick={showForm} style={{ marginBottom: '16px' }}>
                Update Status
              </Button>


              <Button type="primary" onClick={() => handleDelete(id)}>Borrar carrera</Button>
              <Modal
                title="Create Race"
                open={startingFormVisible}
                onCancel={() => setStartingFormVisible(false)}
                onOk={startingForm.submit}
              >
                <Form form={startingForm} onFinish={handleStart}>
                  <p>Estas seguro de que quieres iniciar la carrera</p>
                </Form>
              </Modal>
              <Modal
                title="Create Race"
                open={endingFormVisible}
                onCancel={() => setEndingFormVisible(false)}
                onOk={endingForm.submit}
              >
                <Form form={endingForm} onFinish={handleEnding}>
                  <Form.Item name="winner" label="Winner" rules={[{ required: true }]}>
                    <Select placeholder="Select a winner">
                      {Data?.runners?.map(runner => (
                        <Option key={runner._id} value={runner.name}>
                          {`${runner.name}, ${runner._id}`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="duration" label="duration" rules={[{ required: true }]}>
                    <TimePicker
                      onChange={(time, timeString) => {
                        setTime(timeString);
                      }}
                      format="HH:mm" // Esto asegura que solo se muestre la hora y los minutos en el selector.
                    />
                  </Form.Item>
                  <p>Darle click a OK cambiará el estado de la carrera a terminada con los datos que has introducido</p>
                </Form>
              </Modal>
            </div>
          )}
        </Card>

        <div className="card-container">
        <div className="card-container">
      <CardComponent
        title="Corredores"
        imageSrc="/img/couple.jpg"
        description="Creación, eliminación, actualización y visualización de todos los corredores"
        buttonText="Acceder"
        onClick={handleRunnerClick}
      />
      <CardComponent
        title="Patrocinadores"
        imageSrc="/img/couple.jpg"
        description="Creación, eliminación, actualización y visualización de los patrocinadores"
        buttonText="Acceder"
        onClick={handleSponsorClick}
      />
    </div>
        </div>
      </div>
    </div>
  );
};

export default RaceDataAdmin;
