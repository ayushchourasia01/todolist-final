//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-ayush:Test123@cluster0.ohodlct.mongodb.net/todolistDB");

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];



app.get("/", function(req, res) {

  Item.find({},function(err, foundItems){
   
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
      if(err) {
        console.log(err);
      }
      res.redirect("/");
    });
    } else{
        res.render("list", {listTitle: "Today", newListItems: foundItems });
    }
    
  })

  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const itemAdd = new Item({
    name: itemName
  });
  itemAdd.save();
  res.redirect("/");
  
});

app.post("/delete", function(req, res){

  const checkbox = req.body.checkbox;
  
  Item.deleteOne({_id: checkbox}, function(err){
    if(err){
      console.log("error");
    } else{
      res.redirect("/");
    }
  });
});



app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
