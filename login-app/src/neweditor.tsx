import React, { useRef } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});

const NewEditor = () => {
  const editorRef = useRef();

  const handleSave = async () => {
    const editorInstance = editorRef.current.getInstance();
    const content = editorInstance.getMarkdown();

    try {
      const response = await axios.get('http://localhost:3001/new-editor', { content });
      console.log('Resposta do servidor:', response.data);
    } catch (error) {
      console.error('Erro ao salvar o conteúdo:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Editor
          ref={editorRef}
          initialValue="hello react editor world!"
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut={true}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Salvar
        </Button>
      </div>
    </ThemeProvider>
  );
};

export default NewEditor;
