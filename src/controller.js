import { pool } from "./database.js";

class LibroController{

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }

    async add(req, res){
        const libro = req.body
        const [result] = await pool.query(`INSERT INTO libros (nombre, autor, categoria, añoPublicacion, ISBN) VALUES (?, ?, ?, ?, ?)`,[libro.nombre, libro.autor, libro.categoria, libro.añoPublicacion, libro.ISBN]);
        res.json({"Id insertado": result.insertId});
    }

    async delete(req, res){
        const libro = req.body;
        const [result] = await pool.query(`DELETE FROM libros WHERE ISBN=(?)`, [libro.ISBN]);   
        res.json({"Registros eliminados": result.affectedRows});
    }

    async getOne(req, res){
        const id_libro = req.body.id
        const [result] = await pool.query('SELECT * FROM libros WHERE ID =?',[id_libro]);

        if (result.length > 0){
            res.json(result[0]);
        } else {
            res.status(404).json({Error: 'No se encontro el libro'});
        }
        
    }


}

export const libro = new LibroController();