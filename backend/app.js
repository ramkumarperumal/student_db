const express = require('express');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path')
const cors = require("cors");


const app = express();
app.use(cors());

app.use(express.json());

const dbPath = path.join(__dirname, 'student.db');
let db = null;

const initializeDbAndServer = async () => {
    try{
    db = await open({
        filename : dbPath,
        driver: sqlite3.Database
    });
    app.listen(5000, () => console.log('server listening to http://localhost:5000'));
}
    catch(e){
        console.log(`DB error: ${e.message}`);
        process.exit(1);
    }
}

initializeDbAndServer();

app.get('/students/', async(request, response) => {

    try{
        const getStudentQuery = 'SELECT * FROM student ORDER BY id ASC;';
    const studentArray = await db.all(getStudentQuery);

    response.send(studentArray);
    }

    catch(e){
        console.log(e)
    }

    
})


app.post('/students/', async(request, response) => {


    if(request.body.name){

    try{
        const studentDetails = request.body;
        
    const {name, studentClass, marks} = studentDetails;

    const addStudentQuery = `INSERT INTO student (name, studentClass, marks) VALUES ('${name}', '${studentClass}', ${marks})`;

    await db.run(addStudentQuery);

    response.send('student data added successfully');
    }

    catch(e){
        console.log(e)
    }

    }

    
})

app.put('/students/:id', async(request, response) => {

    try{
        const {id} = request.params;
        const studentDetails = request.body;
        const {name, studentClass, marks} = studentDetails;
    
        const updateStudentQuery = `UPDATE STUDENT SET name='${name}', studentClass='${studentClass}', marks='${marks}' WHERE id=${id};`;
        await db.run(updateStudentQuery);
        response.send('student data updated successfully');
    }

    catch(e){
        console.log(e)
    }


  

    
});



app.delete('/students/:id', async(request, response) => {


    try{
        const {id} = request.params;

    const deleteStudentQuery = `DELETE FROM student WHERE id=${id};`;
    await db.run(deleteStudentQuery);
    response.send('student data deleted successfully');
    }

    catch(e){
        console.log(e)
    }


    

    
})

