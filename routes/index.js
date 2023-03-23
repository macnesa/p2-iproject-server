const { Controller } = require('../controllers')
const { errorHandler, auth } = require('../middlewares')
const router = require('express').Router()



router.get('/', (req, res, next) => {
  res.send('root')
})



router.get('/redirect', Controller.redirect)

router.get('/paymentToken', Controller.getMidtransToken)

router.use(auth)

router.get('/profile', Controller.myProfile)

router.get('/topTracks', Controller.myTopTracks)

router.get('/topArtists', Controller.myTopArtists)

router.get('/recently', Controller.myRecentlyPlayed)

router.get('/nowPlaying', Controller.myCurrentPlaying)

router.get('/findSongs', Controller.findsomeSongs)

router.post('/findSongsByAi', Controller.findSongsByAi)

router.get('/topTracksByArtist', Controller.getTopTracksByArtist)

router.get('/tracksByTopOneTrack', Controller.getTracksRecommendationsByTopOneTrack)

router.get('/topGlobal', Controller.getTopGlobal)

router.get('/topLocal', Controller.getTopLocal)

router.patch('/subcribed', Controller.userSubscribed)


router.get('/download/:id', Controller.downloadSong)





router.use(errorHandler)


module.exports = {
  router
}