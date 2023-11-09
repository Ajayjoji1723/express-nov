const express = require("express");
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "goodreads.db")

let db = null; //initalize with null value

const app = express(); 

//integrating database 

app.use(express.json()) //recognise incoming req as json and parse it to the js file

const initializeDBAndServer= async ()=>{
    try{

        db = await open({
            filename:dbPath,
            driver:sqlite3.Database
        });
        app.listen(3001, ()=>console.log('DB Connected & server running at 3001'));
        

    }catch(e){
        console.log(`DB Error:${e.message}`);
        process.exit(1)
    }
}

initializeDBAndServer();





app.get("/greeting", (req,res)=>{
    res.send("Hello World!");
});

//add BOOK API or Create Book
app.post("/add-book", async(req,res)=>{
    const {
        id,
        title, 
        authorId,
        rating,
        ratingCount,
        reviewCount,
        description,
        pages,
        dateOfPublication,
        editionLanguage,
        price,
        onlineStores
    }= req.body ;

    const addBookQuery = `
    INSERT INTO books(
        id,
        author_id,
        rating,
        rating_count,
        review_count,
        description,
        pages,
        date_of_publication,
        edition_language,
        price,
        online_stores,
        title
        )
    VALUES(
        ${id},
        ${authorId},
        ${rating},
        ${ratingCount},
        ${reviewCount},
        "${description}",
        ${pages},
        "${dateOfPublication}",
        "${editionLanguage}",
        ${price},
        "${onlineStores}",
        "${title}"
    );
`;

const dbResponse = await db.run(addBookQuery);

const bookId = dbResponse.lastID;

res.send(`The Book Added With Book ID of ${bookId}`)


})

//GET BOOK API 

app.get("/books", async(req,res)=>{
    const allbooksQuery = `SELECT * FROM books`;
    const allBooks = await db.all(allbooksQuery);
    console.log(allBooks);

    res.send({allbooks:allBooks})
});

//Specific book 
app.get("/book/:id", async(req,res)=>{
    const {id} = req.params;
    
    const singleBookQuery = `SELECT * FROM books WHERE id = ${id}`;
    const singlBook = await db.get(singleBookQuery);
    res.send(singlBook)
});


//UPDATE BOOK API 
app.put("/update-book/:bookId", async(req,res)=>{
    const {bookId} = req.params ;
    const {title} = req.body;
    const updateBookQuery = `UPDATE books SET title = '${title}' WHERE id= ${bookId};`;
    await db.run(updateBookQuery);
    res.send("Book Updated Succesfully");
});


//DELETE BOOK API

app.delete("/delete-book/:bookId", async(req,res)=>{
    const {bookId}= req.params;
    const deleteBookQuery = `DELETE FROM books WHERE id=${bookId};`
    await db.run(deleteBookQuery);
    res.send("Deleted Successfuly")
})


//Filtering Books API 
app.get("/filter-books", async(req,res)=>{
    const {search_q="", limit=5, offset=1, order, order_by} = req.query;
    
    const filterQuey = `SELECT * FROM books WHERE title LIKE '%${search_q}%' LIMIT ${limit}`;

    const filteredBooks = await db.all(filterQuey);
    res.send(filteredBooks);

})

