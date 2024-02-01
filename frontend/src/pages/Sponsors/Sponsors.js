import React, { useState, useEffect } from 'react';
import { Table, Form, Input, Button, message } from 'antd';
import SponsorService from '../../services/sponsorService';
import Header from '../../components/header/Header';
import { useParams } from 'react-router-dom';
import MyButton from '../../components/buttonBack/buttonBack';

const SponsorsPage = () => {
  const [sponsors, setSponsors] = useState([]);
  const [user, setUser] = useState();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [role, setRole] = useState(); // Establecer el rol según tus necesidades
  const [sponsorsThisRace, setSponsorsThisRace] = useState(false); // Ajusta según tus necesidades
  const token = localStorage.getItem('token');
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
  ];

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await SponsorService.getDataById(id);
        const data = response.data.sponsors;
        const response2 = await SponsorService.getUserByToken(token);
        const data2 = response2.data;
        if (data) {
          setSponsors(data);
          if (data2) {
            setUser(data2);
            if (data2.role === 'sponsor') {
              setRole('sponsor');

              if (data2.sponsor && data2.sponsor._id) {
                const sponsorId = data2.sponsor._id;

                // Verifica si el _id del sponsor está presente en alguno de los sponsors en data
                const isSponsorInData = data.some(sponsor => sponsor._id === sponsorId);

                if (isSponsorInData) {
                  // Realiza la acción que deseas aquí
                  setSponsorsThisRace(true);
                }
              }

            }
          }
        } else {
          console.error('Error fetching sponsors:', response && response.error);
        }
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      }
    };

    fetchSponsors();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await SponsorService.deleteFromRace(id, user.sponsor._id);
      const data = response.sponsors;
      setSponsors(data);
      setSponsorsThisRace(false);
      message.success('Sponsor deleted successfully!');
    } catch (error) {
      console.error('Error deleting sponsor:', error);
    }
  };

  const addToRace = async () => {
    const response=await SponsorService.addSponsorToRace(user.sponsor._id, id);
    setSponsors(response.data.sponsors);
    setSponsorsThisRace(true);
    message.success('Sponsor added to the race!');
  };

  return (
    <div>
    <Header />
    <MyButton/>
    <div className="container">
      
      <h1>Sponsors</h1>
      <Table dataSource={sponsors} columns={columns} pagination={{ pageSize: 5 }} rowKey="_id" />

      {role === 'sponsor' && (
        <Button
          type={sponsorsThisRace ? 'dashed' : 'primary'}
          onClick={sponsorsThisRace ? () => handleDelete() : () => addToRace()}
          style={{ marginTop: '10px' }}
        >
          {sponsorsThisRace ? 'Dejar de financiar' : 'Financia esta carrera'}
        </Button>
      )}
    </div>
    </div>
  );
};

export default SponsorsPage;
