const Genre = require("../models/genre");
const Book = require('../models/book');
const asyncHandler = require("express-async-handler");
const {body,validationResult} = require("express-validator");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenre = await Genre.find().sort({name:1}).exec();
  res.render('genre_list',{title:"Genre List" ,genre_list:allGenre});
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genreDetail,booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre:req.params.id}, "title summary").exec()
  ])

  if(genreDetail === null){
     // No results.
     const err = new Error("Genre not found");
     err.status = 404;
     return next(err);
  }

  res.render("genre_detail",{title:"Genre Detail",genre:genreDetail,genre_books:booksInGenre});

});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render("forms/genre_create",{title:"Genre Create"});
});

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name","Genre name must contain at least 3 characters.")
  .trim()
  .isLength({min:3})
  .escape(),
  asyncHandler(async (req,res,next)=>{

    const errors = validationResult(req);

    const genre = new Genre({name:req.body.name});

    if(!errors.isEmpty()){
      res.render("forms/genre_create",
      {
          title:"Create Genre",
          genre:genre,
          errors:errors.array()
      });
    }else{
       // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({name: req.body.name}).collation({locale:"en",strength:2}).exec();

      if(genreExists){
         // Genre exists, redirect to its detail page.
         res.redirect(genreExists.url);
      }else{
        await genre.save();

        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);

      }

    }

  })
]

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {

    const [genre,genre_books]= await Promise.all([
      Genre.findById(req.params.id).exec(),
      Book.find({ genre:req.params.id },"title summary").exec()
    ])


    if(genre === null){
      res.redirect("/catalog/genres");
    }

    res.render("delete/genre_delete",{
      title:"Delete Genre",
      genre:genre,
      genre_books:genre_books
    })


});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre,genre_books]= await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre:req.params.id },"title summary").exec()
  ])

  if(genre_books.length > 0){

    res.render("delete/genre_delete",{
      title:"Delete Genre",
      genre:genre,
      genre_books:genre_books
    })


  }else{
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/catalog/genres");
  }
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
 const genre = await Genre.findById(req.params.id).exec();

 if (genre === null) {
  // No results.
  const err = new Error("Book not found");
  err.status = 404;
  return next(err);
}

res.render('forms/genre_create',{
  title:"Update Genre",
  genre:genre
})


});

// Handle Genre update on POST.
exports.genre_update_post = [
  body("name","Genre name must contain at least 3 characters.")
  .trim()
  .isLength({min:3})
  .escape(),
  asyncHandler(async (req,res,next)=>{

    const errors = validationResult(req);

    const genre = new Genre({
      _id:req.params.id,
      name:req.body.name
    });

    if(!errors.isEmpty()){
      res.render("forms/genre_create",
      {
          title:"Update Genre",
          genre:genre,
          errors:errors.array()
      });
    }else{
       // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({name: req.body.name}).collation({locale:"en",strength:2}).exec();

      if(genreExists){
         // Genre exists, redirect to its detail page.
         res.redirect(genreExists.url);
      }else{
        const updatedGenre = await Genre.findByIdAndUpdate(req.params.id,genre,{});

        // New genre saved. Redirect to genre detail page.
        res.redirect(updatedGenre.url);

      }
    }

  })
]