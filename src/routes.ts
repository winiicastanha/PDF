import { Router, Request, Response, response } from "express";
import PDFPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { verifyToken } from './middleware/verificarToken';
import path from "path";
import fs from 'fs';
import crypto from 'crypto';
import htmlToPdfmake from 'html-to-pdfmake';
import { JSDOM } from 'jsdom';

const routes = Router();

interface Template {
  name: string;
  content: string;
}

const templates: Record<string, Template> = {};

const generateToken = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

const outputDirectory = path.join(__dirname, '../Documentos/ArquivosGerados');

// Cria a pasta se ela não existir
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

const templatesDirectory = path.join(__dirname, '../Documentos/Templates');

// Cria o diretório se ele não existir
if (!fs.existsSync(templatesDirectory)) {
  fs.mkdirSync(templatesDirectory, { recursive: true });
}


routes.post('/salvar-template', (request: Request, response: Response) => {
  const { name, content } = request.body;
  const token = generateToken();

  templates[token] = { name, content };

  response.json({ token });
});

routes.post('/gerar-pdf/:token', (request: Request, response: Response) => {
  const { token } = request.params;
  const { formData } = request.body;

  const template = templates[token];

  if (!template) {
    return response.status(404).send('Template não encontrado.');
  }

  const fonts = {
    Roboto: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  const printer = new PDFPrinter(fonts);

  // Substituir os placeholders no conteúdo do template
  let content = template.content;
  for (const [key, value] of Object.entries(formData)) {
    const placeholder = new RegExp(`{${key}}`, 'g');
    content = content.replace(placeholder, String(value));
  }

  // Criar uma instância de JSDOM para converter HTML para pdfmake
  const dom = new JSDOM();
  const converted = htmlToPdfmake(content, { window: dom.window });

  // Definição do documento PDF
  const docDefinitions: TDocumentDefinitions = {
    content: converted,
    defaultStyle: {
      font: 'Roboto'
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinitions);
  const fileName = `${token}.pdf`;
  const filePath = path.join(outputDirectory, fileName);
  const writeStream = fs.createWriteStream(filePath);

  pdfDoc.pipe(writeStream);

  pdfDoc.end();

  writeStream.on('finish', () => {
    response.json({ message: 'PDF gerado com sucesso', filePath });
  });

  writeStream.on('error', (error) => {
    console.error('Erro ao salvar o PDF:', error);
    response.status(500).send('Erro ao salvar o PDF.');
  });
});

export { routes };
