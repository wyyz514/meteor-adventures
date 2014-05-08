BookCollection = new Meteor.Collection('bookCollection');
var currentRating = 0;
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
    
    //the title in the alert is the same as the one selected. 
    Template.titleinalert.title = function(){
        var title = BookCollection.findOne(Session.get('selected-title'));
        return title && title.title;
    };
    Template.author.author = function(){
        var obj = BookCollection.findOne(Session.get('selected-title'));
        return obj && obj.author;
    };
    
    //returns the avgRating of the selected-title
    Template.bookrating.avgRating = function(){
        var rating = BookCollection.findOne(Session.get('selected-title'));
        return rating && rating.avgRating;
    };
    
    //stars should become colored when clicked. handles coloring. Note:Coloring not working atm
    //changes without a title being rated yet
    Template.star.events({
    'click': function(){
        $('.starholder').on('click','.stars', function(){
            $(this).addClass('star-selected');
            $(this).prevAll().addClass('star-selected');
            $(this).nextAll().removeClass('star-selected');
            event.preventDefault();
            //fadeToggle not working
            $('.alert').fadeIn('slow');
            //add rating to collection after desired number of stars is selected
            currentRating = $(this).prevAll().length + 1;
            updateCumulativeRating();
            updateAverageRating();
        });
    }
    });
    
    Template.instructiontemplate.instructions = function(){
        return "Instructions";
    };
    
    //show modal for instructions
    Template.instructiontemplate.events({
        'click': function(){
            $('.modal-trigger').on('click','.top-right-text',function(){
                $(this).click(function(){
                    $('#instructions').modal('show');
                });
            });
        }
    });
    
    
    function updateCumulativeRating()
    {
        console.log(currentRating);
        BookCollection.update(Session.get('selected-title'),{$inc:{cumulativeRating:currentRating, numberOfRatings:1}});
    }
    
    function updateAverageRating()
    {
        var numberOfRatings = BookCollection.findOne(Session.get('selected-title')).numberOfRatings;
        var cumulativeRating = BookCollection.findOne(Session.get('selected-title')).cumulativeRating;
        var averageRating = Math.ceil(cumulativeRating / numberOfRatings);
        console.log(averageRating);
        BookCollection.update(Session.get('selected-title'),{$set:{avgRating:averageRating}});
    }
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
