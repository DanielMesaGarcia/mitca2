import React, { useState, useEffect } from 'react';
import { List, Card } from 'antd';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import RaceListService from '../../services/raceListService';
import Footer from '../../components/footer/Footer';
const Home = () => {
  const [races, setRaces] = useState([]);
  const navigate = useNavigate();

  const handleCardClick = (raceId) => {
    navigate(`/racedata/${raceId}`);
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
                  style={{ width: '100%', height: 'auto' }}
                />
              </Card>
              </Link>
            </List.Item>
          )}
        />
      </div>
      </div>
      <Footer></Footer>
    </div>
  );
          }
  

export default Home;
