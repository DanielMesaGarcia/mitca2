// CardComponent.js
import React from 'react';
import { Card, Button } from 'antd';

const CardComponent = ({ title, imageSrc, description, buttonText, onClick }) => {
  return (
    <Card className="custom-card" bordered={false}>
      <div className="card-content">
        <img src={imageSrc} alt={title} className="card-image" />
        <h3>{title}</h3>
        <hr className="divider" />
        <p>{description}</p>
        <Button type="primary" onClick={onClick}>{buttonText}</Button>
      </div>
    </Card>
  );
};

export default CardComponent;
