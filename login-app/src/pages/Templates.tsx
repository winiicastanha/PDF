// src/pages/Templates.tsx
import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import axios from 'axios';
import { Template } from '../types';

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get<Template[]>('http://localhost:3001/templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Erro ao buscar templates', error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Lista de Templates
      </Typography>
      <List>
        {templates.map((template) => (
          <ListItem key={template.id}>
            <ListItemText primary={template.name} secondary={template.content} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Templates;
