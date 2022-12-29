import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval //just a variable

 //function that is going to load our messages (Loading animation)
 function loader(element){
  element.textContent = ''
  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent +='.';

    // If the loading indicator has reached three dots, reset it
    if(element.textContent === '....'){
      element.textContent = '';
    }
  }, 300);// 300 - interval every 3 sec
 } 

 //chatGPT writes sentences one by one,function of that animations:-
 function typeText(element,text){
  let index =0
  
  let interval = setInterval(() => {
    if(index < text.length){
      element.innerHTML += text.charAt(index)
      index++
    }else{
      clearInterval(interval)
    }
  }, 20)
} 

//we have to generate an id for every single message 
function generateUniqueId(){
  //In javascript and  in many other programming languages. how you generate uniques id is by using the current time and date. 
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16); //thats gonna give us 16 characters

  //return id 
  return`id-${timestamp}-${hexadecimalString}`;
}

//A chat Strip dark grey for question and light grey for AI
function chatStripe(isAi,value,uniqueId){
  return (
    //return a template string  ``
    //with regular string you cannot create spaces or enters you have to use template string for that 
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img 
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
            <div class="message" id=${uniqueId}>${value}</div>    
        </div>
      </div>
    `
  )
}

//handle submit function which is going to be the trigger to get the AI generated response
const handleSubmit = async (e) => {
  e.preventDefault()//the default setting is to refresh the page, this prevents that.
  const data = new FormData(form);
  
  //user's chatstrip
  chatContainer.innerHTML += chatStripe(false,data.get('prompt'))

  form.reset()

  //bot's chatStripe
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true," ",uniqueId)//true bcoz AI is typing," " empty string gonna fill the answer as we are loading.

  chatContainer.scrollTop = chatContainer.scrollHeight;//This is going to put new message in view

  const messageDiv = document.getElementById(uniqueId)//we want to fetch this newly created div  

  loader(messageDiv)

  //////////////////////////////////////////////
  //======Connect the Client and Server======//
  //////////////////////////////////////////////

  //Fetch data from server -> bot's response
  const response = await fetch('https://openai-codex-qrwe.onrender.com',{
    method: 'POST',   
    headers:{                                                 //////////////////You made a massive mistake here ... keep in mind ... Its headers... not header
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      prompt:data.get('prompt') //This is the data or the message comming from out text area element on the screen.
    })
  })

  clearInterval(loadInterval) // bcoz we are no longer loading
  messageDiv.innerHTML = " " //

  if(response.ok){
    const data = await response.json(); //this will give actual response from backend.  
    const parsedData = data.bot.trim() //we have to parse the data.

    typeText(messageDiv,parsedData) //pass data 
  }else{
    const err = await response.text()

    messageDiv.innerHTML = "Something went wrong"

    alert(err)

  }
}

//To be able to see changes we have to call handleSubmit. So we will use submit listner and pass handleSubmit
form.addEventListener('submit',handleSubmit)
//The keyup event occurs when a keyboard key is released. "Enter" keycode is 13
form.addEventListener('keyup',(e)=>{  
  if(e.keyCode ===13) {
    handleSubmit(e);
  }
})