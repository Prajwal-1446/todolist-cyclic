const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const _=require('lodash')
require("dotenv").config(); // <---- ADD THIS
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("css"));
let s="";
let itm=[]
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
 
main().catch(err => console.log(err));
    var Item;
 
async function main() {
  await mongoose.connect('process.env.Mongo_db_url');
  console.log("Connected");
  const itemschema={
    name:String,
  };
   Item=mongoose.model("Item",itemschema);
  
  const maggi=new Item({
  name:"Maggi",
  });
  const water=new Item({
    name:"Water",
  })
  const food=new Item({
    name:"Food",
  })
  const di=[maggi,water,food];
  const listschema={
    name:String,
    items:[itemschema]
  };
  const List=mongoose.model("List",listschema);

   
        app.get("/",function(req,res){
   
          Item.find()
          .then(function (items) {
              // console.log(fruits);
              if(items.length==0){
          Item.insertMany(di)
       .then(function(items) {
             console.log("Successfull");
             res.redirect("/")
          })
           .catch(function (err) {
            console.log(err);
           });
          }		
          // items.forEach(function(item) {
          // itm.push(item);
          // });
          else{
            res.render("list",{listTitle:"Today",newListItems:items});
      
          }
          })
          .catch(function (err) {
              console.log(err);
            });
        
        });
        


  
app.post("/",function(req,res){
    const itemname=  req.body.newitem;
    const listname= req.body.list;
    const item=new Item({
      name:itemname
    })
    if(listname==="Today"){
      item.save();
      res.redirect("/");
    }
  //   itm.push(item)
  //  item.save();
  //  res.redirect("/");
  else{
    List.findOne({name:listname})
    .then(function(foundlist){
      foundlist.items.push(item);
      foundlist.save();
      res.redirect("/"+listname);
    })
  }
  });
  app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    const listname=req.body.listName;
    if(listname=="Today"){
      Item. findOneAndDelete(checkedItemId)
      .then(function(items){
        console.log("Removed");
        
        res.redirect("/")
      })
      .catch(function(err){
      console.log(err);
      });
    }else{
      List.findOneAndUpdate({name: listname},{$pull:{items:{_id:checkedItemId}}})
      .then(function(founditem){
        res.redirect("/"+listname);
      })
      .catch(function(err){
        console.log(err);
      });
    }
    
  })
  app.get("/:customlistname",function(req,res){
    const customlistname=_.capitalize(req.params.customlistname);
   
    List.findOne({name:customlistname})
    .then(function(foundlist){
    if(!foundlist){
      //create new list
      const list=new List({
        name:customlistname,
        items:di
      });
      list.save();
      res.redirect("/"+customlistname);
      
    }else{
      //show an existing list
      res.render("list",{listTitle:foundlist.name,newListItems:foundlist.items});

    }
    })
    .catch(function(err){
      console.log(err);
    })
   
});


}



app.post("/work",function(req,res){
    let item=req.body.newitem;
    res.redirect("/work")
})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
 console.log("Server started on port ${port}");
})