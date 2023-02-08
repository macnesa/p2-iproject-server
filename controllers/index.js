const {User} = require('../models')

const baseUrl = 'http://localhost:3000'
const client_redirect_url = 'http://localhost:5173/login'

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const server_key = process.env.SERVER_KEY
const buffer = 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))

const axios = require('axios')
const midtransClient = require('midtrans-client');


class Controller {
  
  static async get(req, res, next) { 
    res.send(req.query)
  }
  
  static async redirect(req, res, next) { 
    try {
      const {code} = req.query  
      const token = await Controller.secondCall(code) 
      const data = token.data.access_token
      
      const request = await Controller.getProfile(data) 
      const {id} = request 
      
      let [user, created] = await User.findOrCreate({
        where: {
          userId: id
        }
      }) 
      // console.log(user, created);
      // let {id: idi} = user
      // let access_token = generateToken({ id }) 
      // let status = (created) ? 201 : 200
      // res.status(status).json({access_token})  
      
      // console.log(token.data.access_token);
      res.redirect(client_redirect_url + '/?token=' + code) 
      // res.redirect(client_redirect_url + '/?token=' + data) 
    } catch (error) {
      next(error) 
      // console.log(error.response.data, 'error nich');
    }
  } 
  
  static async secondCall(code) { 
    try {
      const req = await 
      axios({
        method:'post',
        url:'https://accounts.spotify.com/api/token',
        data: {
          code: code,
          redirect_uri: `${baseUrl}/redirect/`,
          grant_type: "authorization_code"
        },
        headers: {
          // Authorization: 'Basic Mjk2OTRkOTNlMWQyNDUxOGFlYzM0NTUxZWQzNDljNWU6YmI2NTk2ZjkzMTkzNDA3OGIzMGY5OTNiYjM2YWI4Mzk=',
          Authorization: buffer,
          "Content-Type": 'application/x-www-form-urlencoded'
        }
      })
      return req  
    } catch (error) {
      // console.log(error, 'error gaesu');
      throw error
    }
  }
 
  static async getMidtransToken(req, res, next) {  
    const {access_token} = req.headers
    
    try {
        
        let profile = await Controller.getProfile(access_token)
        
        let { country, display_name, id } = profile
      
        // Create Snap API instance
        let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : server_key
        });
        
        let parameter = {
            "transaction_details": {
                "order_id": "macnesa_"+ Math.random(), // harus unique 
                "gross_amount": 10000
            },
            "credit_card":{
                "secure" : true
            },
            "customer_details": {
                "first_name": display_name 
            }
        };
        
        const request = await snap.createTransaction(parameter)
        
        let transactionToken = request.token;
        
        const updateDb = await User.update({paymentToken: transactionToken }, {
          where : {
            userId: id
          }
        })  
        // console.log(updateDb);
        
        // trans action token
        // console.log('transactionToken:',request); 
        res.status(201).json({payment_token: transactionToken })
    } catch (error) {
        next(error)
        // console.log(error);
    }
  }
  
  
  
  
  static async getProfile(access_token) {
    try {
      const {data} = await 
      axios({
        method:'get',
        url:'https://api.spotify.com/v1/me', 
        headers: {
          Authorization: `Bearer `+ access_token,
        }
      })   
      return data   
    } catch (error) {
      // console.log(error);
      throw error
    }
  }
  
  static async myProfile(req, res, next) { 
    const {token} = req 
    try {
      const data = await Controller.getProfile(token)
      
      res.status(200).json(data)
    } catch (error) { 
      next(error)
      // console.log(error, 'error gaes');
    }
  }
//   {
//     "country": "ID",
//     "display_name": "Mac",
//     "explicit_content": {
//         "filter_enabled": false,
//         "filter_locked": false
//     },
//     "external_urls": {
//         "spotify": "https://open.spotify.com/user/31agqd53jnrxrn6cz64zatuegxje"
//     },
//     "followers": {
//         "href": null,
//         "total": 1
//     },
//     "href": "https://api.spotify.com/v1/users/31agqd53jnrxrn6cz64zatuegxje",
//     "id": "31agqd53jnrxrn6cz64zatuegxje",
//     "images": [
//         {
//             "height": null,
//             "url": "https://i.scdn.co/image/ab6775700000ee8553e1c5f011cca9134d43fdf2",
//             "width": null
//         }
//     ],
//     "product": "free",
//     "type": "user",
//     "uri": "spotify:user:31agqd53jnrxrn6cz64zatuegxje"
// }
  
  static async myTopTracks(req, res, next) {
    const {limit} = req.query
    const {access_token} = req.headers
    let url = 'https://api.spotify.com/v1/me/top/tracks' 
    if(limit) url += `?limit=${limit}` 
    try {
      const {data} = await 
      axios({
        method:'get',
        url,
        headers: {
          Authorization: `Bearer `+ access_token,
        }
      })   
      res.status(200).json(data) 
    } catch (error) { 
      next(error)
      // console.log(error, 'error gaes');
    }
  }
  
  static async myTopArtists(req, res, next) {
    const {limit} = req.query
    const {access_token} = req.headers
    let url = 'https://api.spotify.com/v1/me/top/artists' 
    if(limit) url += `?limit=${limit}` 
    try {
      const {data} = await 
      axios({
        method:'get',
        url,
        headers: {
          Authorization: `Bearer `+ access_token,
        }
      })   
      res.status(200).json(data) 
    } catch (error) {
      next(error)
      // console.log(error, 'error gaes'); 
    }
  }
  
  static async myRecentlyPlayed(req, res, next) {
    const {limit} = req.query
    const {access_token} = req.headers
    let url = 'https://api.spotify.com/v1/me/player/recently-played'  
    if(limit) url += `?limit=${limit}` 
    try {
      const {data} = await 
      axios({
        method:'get',
        url,
        headers: {
          Authorization: `Bearer `+ access_token,
        }
      })   
      res.status(200).json(data) 
    } catch (error) {
      next(error)
      // console.log(error, 'error gaes'); 
    }
  }
  
  static async findsomeSongs(req, res, next) {
    const {limit, q} = req.query
    const {access_token} = req.headers
    let url = `https://api.spotify.com/v1/search?q=${q}&type=track`  
    if(limit) url += `&limit=${limit}` 
    try {
      const {data} = await 
      axios({
        method:'get',
        url,
        headers: {
          Authorization: `Bearer `+ access_token,
        }
      })   
      res.status(200).json(data) 
    } catch (error) {
      next(error)
      // console.log(error, 'error gaes'); 
    }
  }
  
  static async getTopGlobal(req, res, next) { 
    const {access_token} = req.headers
    let url = `https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF?limit=1` 
    try {
      const {data} = await 
      axios({
        method:'get',
        url,
        headers: {
          Authorization: `Bearer `+ access_token,
        }
      })   
      res.status(200).json(data) 
    } catch (error) {
      next(error)
      // console.log(error, 'error gaes'); 
    }
  }
  
  
  static async userSubscribed(req, res, next) { 
    const {access_token, payment_token} = req.headers 
    try {
      let profile = await Controller.getProfile(access_token)
      let { country, display_name, id } = profile
      
      let findUser = await User.findOne({
        where: {
          userId: id
        }
      }) 
      
      const {paymentToken} = findUser
      
      console.log(paymentToken);
      console.log(payment_token);
      if(payment_token !== paymentToken) throw {code: 403}
      
      let subscribed = await User.update({isPaid:true}, {
        where: {
          userId: id
        }
      })
      res.status(200).json('subscribed')
    } catch (error) {
      next(error)
      // console.log(error, 'error gaes'); 
    }
  }
  
  static async downloadSong(req, res, next) { 
    const {access_token} = req.headers
    const {id} = req.params
    let url = `https://spotify-downloader.p.rapidapi.com/SpotifytrackDownloader?id=` + id 
    try {
      const {data} = await 
      axios({
        method:'get',
        url,
        headers: {
          "X-RapidAPI-Key": '98612de3b8msh808880aadd1053ep1f2e72jsn1161fad1a865',
          "X-RapidAPI-Host": 'spotify-downloader.p.rapidapi.com'
        }
      })   
      res.status(200).json(data) 
    } catch (error) {
      next(error)
      // console.log(error, 'error gaes'); 
    }
  }
}

module.exports = {
  Controller
}

