import React from 'react';

const Index = ({ ordersLength }) => {
  return (
    <span>
      {ordersLength} commande{ordersLength > 1 ? 's' : ''}
    </span>
  );
}

export default Index;