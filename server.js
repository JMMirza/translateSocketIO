const express = require("express");
const socket = require("socket.io");
const PORT = 3000;
const app = express();
// translate api
const translate = require('@vitalets/google-translate-api');
const gtts = require('gtts')
const fs = require("fs");
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
    console.log(`http://localhost:${PORT}`);
});
app.use(express.static("public"));
// Socket setup
const io = socket(server);
io.on("connection", (socket) => {
    console.log("socket id", socket.id)
    socket.emit("connection",
        "hello there! please send your message and target language")
    socket.on("message", async (message, language) => {
        if (!message || !language) {
            socket.emit("error", "Please Enter complete information")
        }
        try {
            console.log(message, language)
            // call translate method with the text and language as parameters
            const res = await translate(message, {
                to: language
            })
            const outputFilePath = `${__dirname}/public/assets/${socket.id}output.mp3`
            try {
                if (fs.existsSync(outputFilePath)) {
                  //file exists
                  console.log("in delete")
                  fs.unlinkSync(`./public/assets/${socket.id}output.mp3`)
                }
              } catch(err) {
                console.log(err)
                socket.emit("error", err.message)
              }
            var voice = new gtts(res.text,language)

            voice.save(outputFilePath, function (err, result) {
                if (err) {
                    fs.unlinkSync(outputFilePath)
                    socket.emit("error", "Unable to convert to audio")
                }
                else {
                    socket.emit("audio")
                }
            })
            socket.emit("result", res.text)
        } catch (error) {
            console.log(error)
            socket.emit("error", error.message)
        }

    })
    socket.on("disconnect", () => {
        io.emit("user disconnected", socket.id);
    });
})


module.exports = io