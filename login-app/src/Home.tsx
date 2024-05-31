import React, { useState, useEffect, useRef } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Grid } from '@mui/material';
import Quill from 'quill';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'quill/dist/quill.snow.css';
import axios from 'axios';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});

const Home = () => {
  const [templateName, setTemplateName] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Digite seu template de PDF aqui. Use placeholders como {nome}, {idade}.'
      });

      // Estilizar a área de edição como uma folha A4
      const quillEditor = editorRef.current.querySelector('.ql-editor') as HTMLElement;
      if (quillEditor) {
        quillEditor.style.height = '297mm';
        quillEditor.style.width = '210mm';
        quillEditor.style.margin = 'auto';
        quillEditor.style.border = '1px solid #ccc';
        quillEditor.style.padding = '20mm';
        quillEditor.style.backgroundColor = '#fff';
        quillEditor.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
      }
    }
  }, []);

  const handleSaveTemplate = async () => {
    if (quillRef.current) {
      const templateContent = quillRef.current.root.innerHTML;
      try {
        const response = await axios.post('http://localhost:3001/salvar-template', {
          name: templateName,
          content: templateContent
        });
        alert(`Template salvo com sucesso! Token: ${response.data.token}`);
      } catch (error) {
        console.error('Erro ao salvar template', error);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Criar Template de PDF
        </Typography>
        <Paper elevation={3} style={{ padding: '20mm', width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                style={{ width: '100%' }}
                fullWidth
                variant="outlined"
                label="Nome do Template"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <div ref={editorRef} style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
                {/* A área de edição será estilizada como uma folha A4 */}
              </div>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button variant="contained" color="primary" onClick={handleSaveTemplate}>
                Salvar Template
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
