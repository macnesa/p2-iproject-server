if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
 
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const {router} = require('./routes') 
app.use(router) 
// const http = require('http').createServer(app);
// const io = require("socket.io")(http);

// http.listen(port, () => {
//   console.log(
//     `
// ==========================================
// ♻️  MACSPOTIFY SERVER launch on port ${port}
// ==========================================
//     `
//   );
// });
 
app.listen(port, () => {
  console.log(
    `
==========================================
♻️  MACSPOTIFY SERVER launch on port ${port}
==========================================
    `
  )
})














// IMPORTANT COMMENTs


// var redirect_uri = 'http://localhost:3000/redirect/'; // Your redirect uri

// var myCode = 'AQC_TIB-Twa01xZMXvBalPtBe1plZaUMjmC7qnjGLzor7u68exboycNJlIzTs6-wSRqIw4xsRQc_0I2P6FHVdVDMHmXsKd-OMbmJiJvIEtCMUmEV2DJPi3bN7SB-ctYHx23rlin-rkuVVGmoYmcNe2QHRd9MpZBPGyS8gGRxsO5Xw62sauwh9-kcyvWM1R2izdZDehu3sHQBQ7NEb3S8wZLOtePKqCLwRnVc1fhmQkBiTkes3NUyi2spKUsjlsQxTiVkIhpN6AZmuA'

// var request = 'https://accounts.spotify.com/authorize?client_id=29694d93e1d24518aec34551ed349c5e&response_type=code&redirect_uri=http://localhost:3000/redirect/&scope=user-top-read%20user-read-recently-played%20user-read-currently-playing'

// var request_token = 'https://accounts.spotify.com/api/token'

// var access_token = "BQAg-qaRNc7G2ZNxaxlQ1xzjNdgr5ELWJGbBf0-7QF_u7gLGGFFZHdVVxQyxx6xXj3gMnLIyHiGvU9CasZU9y9hujdyMjmq5V23LbpN2Uw6i_rtqOXrb9xVscb2VZWAyjdSA1K3_d6huvCoGDka7xdQhJ01HUXyRfbID0bwcsfX6eMbMoQpAxbxrwlZi6QnWLOxQCjB5cv7nakLO9Y1TlKHZ"

// var server_key = "SB-Mid-server-LLsj1r0T21cb2IQx_o6shDCS"

// Basic Mjk2OTRkOTNlMWQyNDUxOGFlYzM0NTUxZWQzNDljNWU6YmI2NTk2ZjkzMTkzNDA3OGIzMGY5OTNiYjM2YWI4Mzk=




 
 