import { pool } from "./database.js";

class LibroController{

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }

    async add(req, res){
        const libro = req.body;
        const schema = {
            nombre: String,
            autor: String,
            categoria: String,
            añoPublicacion: Date,
            ISBN: String,
          
        };

        try {
            for (const atributo in libro) {
            
              if (!schema.hasOwnProperty(atributo)) {
              // El atributo no existe en el schema
                res.status(400).json({ Error: `El atributo ${atributo} no existe` });
                return;
              }
            }

            const [existeLibro] = await pool.query(
                `SELECT * FROM libros WHERE ISBN = ?`,[libro.ISBN]);
    
                if (existeLibro.length > 0) {
                  res.status(409).json({ Error: 'El libro ya existe' });
              } else {
                  // inserta el libro
                  const [result] = await pool.query(
                      'INSERT INTO libros (nombre, autor, categoria, anioPublicacion, ISBN) VALUES (?, ?, ?, ?, ?)',
                      [libro.nombre, libro.autor, libro.categoria, libro.anioPublicacion, libro.ISBN]
                  );
                  res.json({ "Id Insertado": result.insertId });
              }
          } catch (error) {
              res.status(500).json({ Error: 'Error en los datos de la base' });
          }
    
        }
       
    

    async delete(req, res){
        const libro = req.body;// rescatando los datos del postman
        
        try{
            const [existeLibro] = await pool.query(
                `SELECT * FROM libros WHERE ISBN = ?`,[libro.ISBN]);
    
            if (existeLibro.length > 0) {
                const [result] = await pool.query(`DELETE FROM libros WHERE ISBN=(?)`, [libro.ISBN]);   
                res.json({"Registros eliminados": result.affectedRows});
                  
            } else {
                    res.status(409).json({ Error: 'El libro no existe' });
                  
            } 
        } 
          catch (error) {
              res.status(500).json({ Error: 'Error en los datos de la base' });
          }
        }
        
    
//modificar registro
    async update(req, res){
        const libro = req.body;
        const schema = {
            nombre: String,
            autor: String,
            categoria: String,
            añoPublicacion: Date,
            ISBN: String,
          
          };
        
          try {
            for (const atributo in libro) {
              if (!schema.hasOwnProperty(atributo)) {
              // El atributo no existe en el schema
                res.status(400).json({ Error: `El atributo ${atributo} no existe` });
                return;
              }
            }

            const [existeLibro] = await pool.query(
                `SELECT * FROM libros WHERE ISBN = ?`,[libro.ISBN]);
    
                if (existeLibro.length > 0) {
                  const [result] = await pool.query (`UPDATE libros SET nombre =(?), autor=(?), categoria=(?), añoPublicacion=(?) WHERE ISBN=(?)`, [libro.nombre, libro.autor, libro.categoria, libro.añoPublicacion, libro.ISBN]);
                  res.json({"Registro Modificado": result.changedRows});       
              } else {
                res.status(404).json({ Error: 'Libro no encontrado' });         
    
              }
            } catch (error) {
              res.status(500).json({ Error: 'Error en la base de datos' });
            }
    
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