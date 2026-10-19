import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ProductCard = ({ producto, onAgregar }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{producto.categoria}</Card.Subtitle>
        <Card.Text className="fs-4 fw-bold mt-auto">
          ${producto.precio}
        </Card.Text>
        <Button variant="primary" onClick={() => onAgregar(producto)}>
          Añadir al carrito
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;