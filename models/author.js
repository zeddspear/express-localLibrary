const mongoose = require('mongoose');
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name:{type:String,required:true,maxLength:100},
    family_name:{type:String,required:true,maxLength:100},
    date_of_birth:{type:Date},
    date_of_death:{type:Date}
});

// Virtual for author's full name
AuthorSchema.virtual('name').get(function(){
let full_name="";
if(this.first_name && this.family_name){
    full_name = `${this.first_name} ${this.family_name}`;
}else{
    full_name = "";
}

return full_name;
})


// Virtual for author's URL
AuthorSchema.virtual('url').get(function(){
    return `/catalog/author/${this._id}`;
})


AuthorSchema.virtual("formatted_DOB").get(function(){
    if(this.date_of_birth){
        return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
    }else{
        return "Not Found";
    }
})

AuthorSchema.virtual("formatted_DOD").get(function(){
    if(this.date_of_death){
        return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
    }else{
        return "Not Found";
    }
    
})


AuthorSchema.virtual("DOB_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_birth).toISODate();
  });


AuthorSchema.virtual("DOD_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_death).toISODate();
  });


module.exports = mongoose.model("Author",AuthorSchema);