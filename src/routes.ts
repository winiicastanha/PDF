import { Router, Request, Response } from "express";
import fs from 'fs';

import PDFPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";

const routes = Router();

routes.get("/users", async (request: Request, response: Response) =>{
    console.log("Hello World")

});

routes.get("/gerar-pdf", (request: Request, response: Response) =>{
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
        defaultStyle: {font: "Helvetica"},
        content: [
            {text: 'Meu primeiro PDF'}
        ],
    }

    const pdfDoc = printer.createPdfKitDocument(docDefinitions);

    // pdfDoc.pipe(fs.createWriteStream("Curriculo.pdf"));

    const chunks: any[]= [];

    pdfDoc.on("data", (chunk) =>{
        chunks.push(chunk);

    });
    pdfDoc.end();

    pdfDoc.on("end", () =>{
        const result = Buffer.concat(chunks)
        response.end(result);
     })


})
export { routes };