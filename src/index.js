let quotesList = document.querySelector("#quote-list")
let newQuoteForm = document.getElementById('new-quote-form');

fetch("http://localhost:3000/quotes?_embed=likes")
 .then(resp => resp.json())
 //returned response to json
 .then ((quotesArray ) =>{
// what you want to do with the object 
    //console log and you will see that it is an array
    quotesArray.forEach((quoteObj)=>{
        turnQuoteIntoHTML(quoteObj);
    })
    //not all apis serve just arrays; we could get an object back
 })
 newQuoteForm.addEventListener("submit", (e)=>{
     e.preventDefault()
     let author = e.target["author"].value;

     let quoteContent = e.target["new-quote"].value;
     fetch("http://localhost:3000/quotes", {
         method: "POST",
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            author: author,
            quote: quoteContent
         })
     })
     .then(resp => resp.json())
     .then((newQuote)=> {
        newQuote.likes =[]
        turnQuoteIntoHTML(newQuote);

    })
 })

 function turnQuoteIntoHTML(quoteObj){
     

//will follow a similar pattern to this: 

//<li class='quote-card'>
  //  <blockquote class="blockquote">
    //  <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
     // <footer class="blockquote-footer">Someone famous</footer>
     // <br>
     // <button class='btn-success'>Likes: <span>0</span></button>
     // <button class='btn-danger'>Delete</button>
   // </blockquote>
  //</li>
//START BY CREATING THE OUTERMOST ELEMENT
let outerElement = document.createElement("li")
outerElement.className = "quote-card"
  //FILL THE OUTERMOST ELEMENT USING INNERHTML
  outerElement.innerHTML = 
  `<blockquote class="blockquote">
     <p class="mb-0">${quoteObj.quote}</p>
    <footer class="blockquote-footer">${quoteObj.author}</footer>
     <br>
     <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
     <button class='btn-danger'>Delete</button>
   </blockquote>
    ` 
    //APPEND THE OUTERMOST ELEMENT TO THE DOM
    quotesList.append(outerElement)

    // GRAB THE ELEMENTS FROM THE OUTER ELEMENT
    let deleteButton = outerElement.querySelector(".btn-danger");
    let likeButton = outerElement.querySelector(".btn-success");
    let likeSpan = outerElement.querySelector("span");
    //you won't write document.que... you'll always look inside your outer element

    //ADD EVENT LISTENER
    deleteButton.addEventListener("click", (e) => {
        
        fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
            method: "DELETE"
    })
    
    //all needed to change on back end is the id from the backend
    //deletes don't require any body nor headers
    .then(resp =>resp.json())
    .then((response)=>{
        outerElement.remove()
    })
// will remove from the DOM now

//CREATE A LIKE BUTTON COUNTER
    likeButton.addEventListener("click", (e) => {
        fetch ("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringigy({
                quoteId:quoteObj.id
            })
        })//cannot call.then on somehting inside of the fetch, always outside
        .then (resp =>resp.json())
        .then ((newLike)=> {
            quoteObj.likes.push(newLike);
            likeSpan.innerText = quoteObj.likes.length;
        })
    })
})
 }