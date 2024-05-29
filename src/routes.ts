import { Router, Request, Response } from "express";
import PDFPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { verifyToken } from './middleware/verificarToken';

const routes = Router();

routes.post("/gerar-pdf", verifyToken, (request: Request, response: Response) => {
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
            { text: 'Meu primeiro PDF' }
        ],
    }

    const pdfDoc = printer.createPdfKitDocument(docDefinitions);

    const chunks: any[] = [];

    pdfDoc.on("data", (chunk) => {
        chunks.push(chunk);
    });
    pdfDoc.end();
    console.log('PDF gerado com sucesso');

    pdfDoc.on("end", () => {
        const result = Buffer.concat(chunks);
        response.end(result);
    });
});

export { routes };
