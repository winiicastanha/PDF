import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        // Use a variável de ambiente para verificar o token
        if (token === process.env.AUTH_GERAR_TOKEN) {
            next(); // token válido, prosseguir
        } else {
            res.status(403).json({ message: "Token inválido" });
        }
    } else {
        res.status(401).json({ message: "Nenhum token fornecido" });
    }
};
