const { User } = require("../models");

const baseUrl = process.env.BASEURL; // This server's link

const client_redirect_url = process.env.CLIENT_REDIRECT_URL; // Your deployed url to get access_token and use it to access server's endpoints

const client_id = process.env.CLIENT_ID; // Your spotify client id

const client_secret = process.env.CLIENT_SECRET; // Your spotify secret

const server_key = process.env.SERVER_KEY; // Your midtrans key

const buffer =
  "Basic " +
  new Buffer.from(client_id + ":" + client_secret).toString("base64"); // base64 data for spotify authorization process

const axios = require("axios");

const midtransClient = require("midtrans-client");

class Controller {
  static async redirect(req, res, next) {
    try {
      const { code } = req.query;
      
      
      const token = await Controller.secondCall(code);
      const data = token.data.access_token;
      
      const request = await Controller.getProfile(data);
      const { id } = request;
      
      let [user, created] = await User.findOrCreate({
        where: {
          userId: id,
        },
      });
      
      res.redirect(client_redirect_url + "/?token=" + data);
    } catch (error) {
      console.log(error, "moideh es hashem");
      next(error);
    }
  }

  static async secondCall(code) {
    try {
      const req = await axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        data: {
          code: code,
          redirect_uri: `${baseUrl}/redirect/`,
          grant_type: "authorization_code",
        },
        headers: {
          Authorization: buffer,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return req;
    } catch (error) {
      throw error;
    }
  }

  static async getMidtransToken(req, res, next) {
    const { access_token } = req.headers;
    try {
      let profile = await Controller.getProfile(access_token);

      let { country, display_name, id } = profile;

      // Create Snap API instance
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: server_key,
      });

      let parameter = {
        transaction_details: {
          order_id: "macSpotify_" + Math.random(), // harus unique
          gross_amount: 10000,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: display_name,
        },
      };

      const request = await snap.createTransaction(parameter);

      let transactionToken = request.token;

      await User.update(
        { paymentToken: transactionToken },
        {
          where: {
            userId: id,
          },
        }
      );
      res.status(201).json({ payment_token: transactionToken });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(access_token) {
    try {
      const { data } = await axios({
        method: "get",
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async myProfile(req, res, next) {
    const { token } = req;
    try {
      const data = await Controller.getProfile(token);
      const { id } = data;
      const user = await User.findOne({
        where: {
          userId: id,
        },
      });
      const { isPaid } = user;

      res.status(200).json({ spotify: data, isPaid });
    } catch (error) {
      next(error);
    }
  }

  static async myTopTracks(req, res, next) {
    const { limit } = req.query;
    const { access_token } = req.headers;
    let url = "https://api.spotify.com/v1/me/top/tracks";
    if (limit) url += `?limit=${limit}`;
    try {
      const { data } = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async myTopArtists(req, res, next) {
    const { limit } = req.query;
    const { access_token } = req.headers;
    let url = "https://api.spotify.com/v1/me/top/artists";
    if (limit) url += `?limit=${limit}`;
    try {
      const { data } = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async myRecentlyPlayed(req, res, next) {
    const { limit } = req.query;
    const { access_token } = req.headers;
    let url = "https://api.spotify.com/v1/me/player/recently-played";
    if (limit) url += `?limit=${limit}`;
    try {
      const { data } = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  
  
  static async myCurrentPlaying(req, res, next) {
    const { limit } = req.query;
    const { access_token } = req.headers;
    let url = "https://api.spotify.com/v1/me/player/currently-playing";
    if (limit) url += `?limit=${limit}`;
    try {
      const { data } = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async findsomeSongs(req, res, next) {
    const { limit, q } = req.query;
    const { access_token } = req.headers;
    // let url = `https://api.spotify.com/v1/search?q=${q}&type=track,album,playlist,artist&limit=2`;
    let url = `https://api.spotify.com/v1/search?q=${q}&type=track&limit=30`;
    if (limit) url += `&limit=${limit}`;
    try {
      const { data } = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  
  
  static async findSongsByAi (req, res, next) {
    console.log(req.body); 
        const { access_token } = req.headers; 
    const strin = ["shabbos", "purim", "jewish pesach"]
     
      Promise.all(strin.map(strind => {
        
            const q = encodeURIComponent(strind);
            let url = `https://api.spotify.com/v1/search?q=${q}&type=track&limit=2`;

            return axios({
            url,
            method: 'get',
            headers: {
              Authorization: `Bearer ` + access_token,
            }
          }) 
        
      }))
      .then(response => {
        let result = []
        response.forEach(each => {
          each.data.tracks.items.forEach((each,index) => {  
            result.push(each)
          })
        })
        
        
        console.log(result, "simcha");
        
        res.status(200).json(result);
        
        
      })
      .catch(error =>  next(error))
    
    
    // const { limit, q } = req.query;
    // let url = `https://api.spotify.com/v1/search?q=${q}&type=track&limit=2`;
    // if (limit) url += `&limit=${limit}`;
    // try {
    //   const { data } = await axios({
    //     method: "get",
    //     url,
    //     headers: {
    //       Authorization: `Bearer ` + access_token,
    //     },
    //   });
    //   res.status(200).json(data);
    // } catch (error) {
    //   next(error);
    // }
  }

  static async getTopGlobal(req, res, next) {
    const { access_token } = req.headers;
    let url = `https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF`;

    try {
      const { data } = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  
  
  
  static async getTopLocal(req, res, next) {
    const { access_token } = req.headers; 
    const userCountry = new Intl.DisplayNames(['en'], {type: 'region'}).of(req.userCountry).replace(/\s+/g, '-'); //in english
    
    let url = `https://api.spotify.com/v1/search?type=playlist&q=Top%2050%20${userCountry}&limit=3`;
    
    try {
      const { data } = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      });
      
      const top50songPlaylistLink = data.playlists.items[0].href
      
      const { data: resuld } = await axios({
        method: "get",
        url: top50songPlaylistLink,
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      });
       
      
      // console.log(resuld) 
       
      res.status(200).json(resuld);
    } catch (error) {
      next(error);
    }
  }
  
  
  static async getTracksRecommendationsByTopOneTrack(req, res, next) {
    const { access_token } = req.headers;
    const {trackId, artistId} = req.query
    let url = `https://api.spotify.com/v1/recommendations?limit=20&seed_tracks=${trackId}&seed_artists=${artistId}&min_popularity=30`;
    // let url = `https://api.spotify.com/v1/recommendations?limit=20&seed_tracks=3fVyiIB5BT5KjSqoRTeqce&seed_artists=3JPKPnzWJGjccn8SnjwA5i&min_popularity=30`;
    
    try {
      const { data } = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getTopTracksByArtist(req, res, next) {
    const { access_token } = req.headers;
    const { artistId } = req.query;  
    // let url = `https://api.spotify.com/v1/artists/69GGBxA162lTqCwzJG5jLp`;
    let url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=${req.userCountry}`;
    // let url = `https://api.spotify.com/v1/search?type=artist&q=tulus`; 
    try {
      const { data } = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ` + access_token,
        },
      }); 
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  
  static async userSubscribed(req, res, next) {
    const { access_token, payment_token } = req.headers;
    try {
      const { id: userId } = await Controller.getProfile(access_token);

      const { paymentToken } = await User.findOne({
        where: {
          userId,
        },
      });

      if (payment_token !== paymentToken) throw { code: 403 };

      let subscribed = await User.update(
        { isPaid: true },
        {
          where: {
            userId,
          },
        }
      );

      res.status(200).json({ message: "subscribed" });
    } catch (error) {
      next(error);
    }
  }

  static async downloadSong(req, res, next) {
    const { id } = req.params;
    let url =
      `https://spotify-downloader.p.rapidapi.com/SpotifytrackDownloader?id=` +
      id;
    try {
      const { data } = await axios({
        method: "get",
        url,
        headers: {
          "X-RapidAPI-Key":
            "98612de3b8msh808880aadd1053ep1f2e72jsn1161fad1a865",
          "X-RapidAPI-Host": "spotify-downloader.p.rapidapi.com",
        },
      });
      res.status(200).json(data.link);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  Controller,
};
