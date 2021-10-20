const socket = io();

const inboxPeople = document.querySelector(".inbox__people");
const msgInputField = document.querySelector(".message_form__input");
const langInputField = document.querySelector(".language_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");
const audioMessageBox = document.querySelector(".audio_messages__history")
const errorMessageBox= document.querySelector(".error__history__server")
const serverMessageBox = document.querySelector(".messages__history__server");
const fallback = document.querySelector(".fallback");
let path=""
const addTransMessage = ({
    message
}) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric"
    });
    messageBox.innerHTML = `
  <div class="outgoing__message">
    <div class="sent__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;
};
const addConnMessage = (
    message
) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric"
    });
    serverMessageBox.innerHTML =`
    <div class="incoming__message">
      <div class="received__message">
        <p>${message}</p>
        <div class="message__info">
          <span class="time_date">${formattedTime}</span>
        </div>
      </div>
    </div>`;
}
const addErrorMessage = (
  message
) => {
  const time = new Date();
  const formattedTime = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric"
  });
  errorMessageBox.innerHTML =`
  <div class="incoming__message">
    <div class="received__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;
}

const audioMessage = () => {
   path= `assets/${socket.id}output.mp3`
  audioMessageBox.innerHTML = `
    <audio controls autoplay>
          <source src=${path} type="audio/mpeg">
          Your browser does not support the audio element.
    </audio>`;
     path=""
}
// new user is created so we generate nickname and emit event
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!msgInputField.value || !langInputField.value) {
        return;
    }
    socket.emit("message", msgInputField.value, langInputField.value);

    msgInputField.value = "";
});

socket.on("result", function (userName) {
    addTransMessage({
        message: userName
    });
});
socket.on("connection", (message) => {
    console.log("socketid", socket.id)
    addConnMessage(message)
    
})
socket.on("audio",()=>{
  console.log("in else")
  audioMessage()
})
socket.on("error",(message)=>{
  addErrorMessage(message)
})