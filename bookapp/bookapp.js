BookCollection = new Meteor.Collection('bookCollection');

if (Meteor.isClient) {
    Template.books.book = function(){
        return BookCollection.find();
    };
    
   Template.title.events({
   'click' : function(){
       Session.set('selected-title',this._id);
   }
   });
    
   Template.title.selected = function(){
        return Session.equals('selected-title',this._id) ? 'selected':'';
   };
    
    Template.bookinfo.selected_title = function(){
        var name = BookCollection.findOne(Session.get('selected-title'));
        return name && name.title;
    };
    
    Template.author.author = function(){
        var obj = BookCollection.findOne(Session.get('selected-title'));
        return obj && obj.author;
    };
    
    Template.bookrating.avgRating = function(){
        var rating = BookCollection.findOne(Session.get('selected-title'));
        return rating && rating.avgRating;
    };
    
    $('.stars').hover({
        
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
      if(BookCollection.find().count() == 0)
      {
          var bookData = [{title:'The Great Gatsby',author:'F. Scott Fitzgerald'},{title:'The Grapes of Wrath', author:'John Steinbeck'},
                          {title:'1984',author:'George Orwell'},{title:'Catch-22',author:'Joseph Heller'},
                          {title:'To Kill A Mockingbird',author:'Harper Lee'}, 
                          {title:'Brave New World',author:'Aldous Huxley'},
                          {title:'Pride and Prejudice',author:'Jane Austen'},
                          {title:'Lord of the Flies',author:'William Golding'},
                          {title:'Animal Farm',author:'George Orwell'},
                          {title:'War and Peace',author:'Leo Tolstoy'}
                         ];
          
          for(var index = 0; index < bookData.length; index++)
          {
              BookCollection.insert({title:bookData[index].title, author:bookData[index].author, avgRating:0, cumulativeRating:0, numberOfRatings:0});
          }
      }
  });
}
