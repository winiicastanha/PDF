import express from 'express';
import dotenv from 'dotenv';

import { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import PDFPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { verifyToken } from './middleware/verificarToken';

const app = express();

dotenv.config();
app.use(bodyParser.json());

const routes = express.Router();

routes.post("/gerar-pdf", (request: Request, response: Response) => {
    const {
        nome_usuario,
        nascimento,
        rua,
        numero,
        cidade,
        estado,
        telefone_residencia,
        telefone_recado,
        email_user,
        complemento,
        objetivo_profissional,
        caracteristicas_perfil,
        escolaridade,
        experiencia_profissional,
        data_finalizacao_coletivo,
        formacao_complementar,
        trabalho_voluntario,
        idioma
    } = request.body;

    if (!request.body) {
        return response.status(400).json({ error: "O corpo da requisição está vazio." });
    }

    const fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        }
    };
    const printer = new PDFPrinter(fonts);

    const docDefinitions: TDocumentDefinitions = {
        defaultStyle: { font: "Helvetica" },
        content: [
            { text: `Nome de Usuário: ${nome_usuario}`, style: 'header' },
            { text: `Data de nascimento: ${nascimento}`, style: 'subheader' },
            { text: `Endereço: ${rua}, ${numero} – ${cidade}, ${estado}`, style: 'subheader' },
            { text: `Telefone: ${telefone_residencia}`, style: 'subheader' },
            { text: `Telefone de recado: ${telefone_recado}`, style: 'subheader' },
            { text: `Email: ${email_user}`, style: 'subheader' },
            { text: `Complemento: ${complemento}`, style: 'subheader' },
            { text: 'OBJETIVOS', style: 'sectionHeader' },
            { text: objetivo_profissional, style: 'content' },
            { text: 'CARACTERÍSTICAS DO PERFIL', style: 'sectionHeader' },
            { text: caracteristicas_perfil, style: 'content' },
            { text: 'ESCOLARIDADE', style: 'sectionHeader' },
            { text: escolaridade, style: 'content' },
            { text: 'EXPERIÊNCIA PROFISSIONAL', style: 'sectionHeader' },
            { text: experiencia_profissional, style: 'content' },
            { text: 'FORMAÇÃO COMPLEMENTAR', style: 'sectionHeader' },
            { text: `Coletivo Online - Preparação para o Mercado de trabalho - Instituto Coca-Cola Brasil - Conclusão: ${data_finalizacao_coletivo}`, style: 'content' },
            { text: formacao_complementar, style: 'content' },
            { text: 'TRABALHO VOLUNTÁRIO', style: 'sectionHeader' },
            { text: trabalho_voluntario, style: 'content' },
            { text: 'IDIOMA', style: 'sectionHeader' },
            { text: idioma, style: 'content' }
        ],
        styles: {
            header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
            subheader: { fontSize: 14, margin: [0, 10, 0, 5] },
            sectionHeader: { fontSize: 16, bold: true, margin: [0, 15, 0, 10] },
            content: { fontSize: 12, margin: [0, 0, 0, 10] }
        }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinitions);

    const chunks: Buffer[] = [];

    pdfDoc.on("data", (chunk) => {
        chunks.push(chunk);
    });

    pdfDoc.on("end", () => {
        const result = Buffer.concat(chunks);
        response.setHeader('Content-Type', 'application/pdf');
        response.end(result);
    });

    pdfDoc.end();
    console.log('PDF gerado com sucesso');
});

app.use('/api', routes);

const port = 3300;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});