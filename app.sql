CREATE TABLE books(
    id INTEGER ,
    author_id INT,
    rating INT,
    rating_count INT,
    review_count INT,
    description TEXT,
    pages INT,
    date_of_publication TEXT,
    edition_language TEXT,
    price INT,
    online_stores TEXT
)


SELECT * FROM books WHERE id = 2;