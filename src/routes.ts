import { Router, Request, Response, response } from "express";
import PDFPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { verifyToken } from './middleware/verificarToken';
import path from "path";
import fs from 'fs';

const routes = Router();

routes.post("/gerar-curriculo", verifyToken, (request: Request, response: Response) => {
    console.log('Request body:', request.body);

    if (!request.body || Object.keys(request.body).length === 0) {
        return response.status(400).send("O corpo da requisição está vazio ou mal formatado.");
    }
    //definindo variáveis
    const {
        unique_id,
        nome_usuario,
        nascimento,
        rua,
        numero,
        cidade,
        estado,
        complemento,
        telefone_residencia,
        telefone_recado,
        email_user,
        objetivo_profissional,
        caracteristicas_perfil,
        escolaridade,
        experiencia_profissional,
        data_finalizacao_coletivo,
        formacao_complementar,
        trabalho_voluntario,
        idioma
    } = request.body;

    //verificando se o campo unique_id foi preenchido
    if (!unique_id) {
        return response.status(400).send("O campo 'unique_id' é obrigatório.");
    }

    //definindo fontes
    const fonts = {
        Inter: {
            normal: path.join(__dirname, '..', 'fonts', 'Inter-Regular.ttf'),
            bold: path.join(__dirname, '..', 'fonts', 'Inter-Bold.ttf'),
            italics: path.join(__dirname, '..', 'fonts', 'Inter-Italic.ttf'),
            bolditalics: path.join(__dirname, '..', 'fonts', 'Inter-BoldItalic.ttf')
        }
    };
    const printer = new PDFPrinter(fonts);
    //passando as definições de fonte para a geração do documento
    const docDefinitions: TDocumentDefinitions = {
        defaultStyle: { font: "Inter" },
        content: [
            
            //nome
            { text: `${nome_usuario}`, style: 'fonte_nome' },
            
            //dados_pessoais
            { text: `Data de nascimento: ${nascimento}`, style: 'fonte_dados_pessoais' },
            { text: `Endereço: ${rua} ${numero} – ${cidade} ${estado}`, style: 'fonte_dados_pessoais'  },
            { text: `Complemento: ${complemento}`, style: 'fonte_dados_pessoais'  },
            { text: `Telefone: ${telefone_residencia}`, style: 'fonte_dados_pessoais'  },
            { text: `Telefone de recado: ${telefone_recado}`, style: 'fonte_dados_pessoais'  },
            { text: `Email: ${email_user}`, style: 'fonte_dados_pessoais'  },
            
            //Objetivos
            { text: 'OBJETIVOS', style: 'fonte_titulo_itens' },
            { text: `${objetivo_profissional}` },
            
            //Caracteristicas do perfil
            { text: 'CARACTERÍSTICAS DO PERFIL', style: 'fonte_titulo_itens' },
            { text: `${caracteristicas_perfil}`, style: 'fonte_itens' },

            //Escolaridade
            { text: 'ESCOLARIDADE', style: 'fonte_titulo_itens' },
            { text: `${escolaridade}`, style: 'fonte_itens' },
            
            //Experiência profissional
            { text: 'EXPERIÊNCIA PROFISSIONAL', style: 'fonte_titulo_itens' },
            { text: `${experiencia_profissional}`, style: 'fonte_itens'  },

            //Formação complementar
            { text: 'FORMAÇÃO COMPLEMENTAR', style: 'fonte_titulo_itens' },
            { text: `Coletivo Online - Preparação para o Mercado de trabalho - Instituto Coca-Cola Brasil - Conclusão: ${data_finalizacao_coletivo}` },
            { text: `${formacao_complementar}`, style: 'fonte_itens' },

            //Trabalho voluntário
            { text: 'TRABALHO VOLUNTÁRIO', style: 'fonte_titulo_itens' },
            { text: `${trabalho_voluntario}`, style: 'fonte_itens' },

            //Idioma
            { text: 'IDIOMA', style: 'fonte_titulo_itens' },
            { text: `${idioma}`, style: 'fonte_itens' }
        ],
        //definindo estilos dos campos, fontes etc...
        styles: {

            fonte_nome: {
                fontSize: 18,
                margin: [0, 4, 0, 2], // [left, top, right, bottom]
                bold: true,
            },
            fonte_dados_pessoais: {
                fontSize: 11,
                margin: [0, 2, 0, 0]
            },
            fonte_titulo_itens: {
                fontSize: 14,
                margin: [0, 16, 0, 1],
                bold: true
            },
            fonte_itens: {
                fontSize: 11,
                margin: [0, 2, 0, 2]
            }
        },
        pageMargins: [60, 60, 60, 60]
    };
    //definindo variavel de criação do documento
    const pdfDoc = printer.createPdfKitDocument(docDefinitions);

    //defindo o path de onde esse arquivo será salvo
    const outputPath = path.join(__dirname, '..', 'Documentos', 'Curriculos', `${unique_id}_curriculo.pdf`);
    const writeStream = fs.createWriteStream(outputPath);

    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    writeStream.on('finish', () => {
        console.log('PDF gerado e salvo com sucesso em:', outputPath);
        response.status(200).send(`PDF gerado e salvo com sucesso em: ${outputPath}`);
    });

    writeStream.on('error', (err) => {
        console.error('Erro ao salvar o PDF:', err);
        response.status(500).send('Erro ao salvar o PDF.');
    });
});

export { routes };
