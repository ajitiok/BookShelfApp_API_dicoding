const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = ( req, h) => {
  const { name, year , author, summary, publisher, pageCount, readPage, reading } = req.payload;

  const id = nanoid(16);
  const finished = isFinished(pageCount, readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt; 

  const newBook = {
    id, name, year , author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };
  books.push(newBook);
  const isSuccess = books.filter((book)=> book.id === id).length > 0;

  if ( isSuccess && name && ( parseInt(readPage) <= parseInt(pageCount))) {
    const resp = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      }
    })
    resp.code(201);
    return resp
  }

  if ( !name ) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    for( let i = 0; i < books.length; i++){  
      if ( books[i].id === id) { 
          books.splice(i, 1); 
      }
    }
  
    return response;
  }else if ( parseInt(readPage) >= parseInt(pageCount) ) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    for( let i = 0; i < books.length; i++){ 
      if ( books[i].id === id) { 
          books.splice(i, 1); 
      }
    }
    return response;
  }else {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    for( let i = 0; i < books.length; i++){ 
      if ( books[i].id === id) { 
          books.splice(i, 1); 
      }
    }
    return response;
  }
};

const isFinished = ( page_count, read_page) => {
  return page_count === read_page ? true : false 
}

const getAllBookHandler = (req,h) => {
  
  const response = h.response({
    status: 'success',
    data: {
      books : books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  });
  response.code(200);
  return response;
}

const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const book = books.filter((book) => book.id === bookId)[0];
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const { name, year , author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1 && name && ( parseInt(readPage) <= parseInt(pageCount))) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }


  if ( !name ) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    // for( let i = 0; i < books.length; i++){  
    //   if ( books[i].id === id) { 
    //       books.splice(i, 1); 
    //   }
    // }
  
    return response;
  }else if ( parseInt(readPage) > parseInt(pageCount) ) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    // for( let i = 0; i < books.length; i++){ 
    //   if ( books[i].id === id) { 
    //       books.splice(i, 1); 
    //   }
    // }
    return response;
  }else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}

module.exports = { 
  addBookHandler, 
  getAllBookHandler, 
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}