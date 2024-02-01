import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import Header from '../../components/header/Header';
import './RaceData.css';
import RaceDataService from '../../services/raceDataService';
import { useNavigate, useParams } from 'react-router-dom';
import { checkIfAlreadySubscribed,
  getAllSubscriptions } from '../../services/helper';
import MyButton from '../../components/buttonBack/buttonBack';
import CardComponent from '../../components/cards/cards';

const RaceData = () => {
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


  const [subscribed, setSubscribed] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionName, setSubscriptionName] = useState("Carreras");
  useEffect(() => {
    checkSubscriptionState();
    
    getAllSubscriptions().then((res) => {
      setSubscriptions(res.data);
    });
    setSubscriptionName("Carreras");
  }, []);

  

  const checkSubscriptionState = async () => {
    const subscriptionState = await checkIfAlreadySubscribed();
    setSubscribed(subscriptionState);
  }


  

  useEffect(() => {
    getAllSubscriptions().then((res) => {
      setSubscriptions(res.data);
    });
    
  }, [subscribed]);

  const [ourText, setOurText] = useState("")
  const msg = new SpeechSynthesisUtterance()

  const speechHandler = () => {
    if(Data.status.statusAtTheMoment !== 'No empezada' && Data.status.statusAtTheMoment !== 'En curso'){
      setOurText('Puntos de control: '+Data.route.checkpoint+', Lugar de inicio: '+Data.route.startPoint+', Meta: '+Data.route.goal+', Estado actual: '+Data.status.statusAtTheMoment+', Ganador:'+Data.status.winner+', Duracion: '+Data.status.duration)
    }else{
      setOurText('Puntos de control: '+Data.route.checkpoint+', Lugar de inicio: '+Data.route.startPoint+', Meta: '+Data.route.goal+', Estado actual: '+Data.status.statusAtTheMoment)
    }
    msg.text = ourText
    window.speechSynthesis.speak(msg)
  }


  return (
    <div >
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

export default RaceData;
