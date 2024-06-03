import { Router, Request, Response } from "express";
import PDFPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import path from "path";
import fs from 'fs';
import crypto from 'crypto';
import htmlToPdfmake from 'html-to-pdfmake';
import { JSDOM } from 'jsdom';

const routes = Router();

interface Template {
  id: string;
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

routes.post('/salvar-template', (request: Request, response: Response) => {
  const { name, content } = request.body;
  const id = generateToken();

  // Cria o diretório para o template se ele não existir
  const templateDirectory = path.join(__dirname, `../Documentos/Templates/${name}`);
  if (!fs.existsSync(templateDirectory)) {
    fs.mkdirSync(templateDirectory, { recursive: true });
  }

  // Salva o template em um arquivo HTML
  const filePath = path.join(templateDirectory, `${id}.html`);
  fs.writeFileSync(filePath, content, 'utf8');

  // Salva a referência do template em memória
  templates[id] = { id, name, content };

  response.json({ id });
});

routes.post('/gerar-pdf/:id', (request: Request, response: Response) => {
  const { id } = request.params;
  const { formData } = request.body;
  const { nome_arquivo } = request.body;

  // Verifica se o template está em memória
  let template = templates[id];

  // Se não estiver em memória, tenta carregar do sistema de arquivos
  if (!template) {
    const templateDirectories = fs.readdirSync(path.join(__dirname, '../Documentos/Templates'));
    for (const dir of templateDirectories) {
      const filePath = path.join(__dirname, `../Documentos/Templates/${dir}/${id}.html`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        template = { id, name: dir, content };
        templates[id] = template; // Opcional: adicionar de volta à memória
        break;
      }
    }
  }

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
  const fileName = `${nome_arquivo}.pdf`;
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
