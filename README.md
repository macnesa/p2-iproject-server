# **P2-Phase 2 Iproject Hacktiv8 Challenge-Integration-Server**
>REST API | Phase 2 Iproject Hacktiv8 Challenge laboiduseichu
 

# **Endpoints:**
For staff and admins:
- `/redirect  ( GET )`  

- `/paymentToken ( GET )`

- `/profile ( GET )` 

- `/topTracks ( GET )`

- `/topArtists ( GET )` 

- `/recently ( GET )` 

- `/findSongs (GET , POST)`

- `/topGlobal  ( GET )` 

- `/subcribed  ( PATCH )` 

- `/download/:id  ( GET )` 
___
 

### `/redirect | GET` 
-  Spotify first call authentication endpoint 

#### Request 
- query 
```json
?code= <first_call_authentication_code_from_spotify>
```

#### Response
- 201 - Created
```json
{
	 "id" : 1,
   "email": "tadgh@gmail.com"
}
```

- 400 - bad request
```json
{
  "error": "Email with such name already exists"
}
```

### `/profile | GET` 
- Request user's spotify account information

#### Request
- headers ( access_token is a valid spotify' second call authentication )
```json
{
  "access_token": "example:18721h12w1kj.dchudsasxa"
}
```

#### Response
- 200 - OK
```json
{
    "spotify": {
      ...
    },
    "isPaid": true
}
```

- 401 - Unrecognized
```json
{
    "message": "Invalid access token"
}
```
```json
{
    "message": "The access token expired"
}
```

## `/topTracks | GET` 
- Get user's top spotify tracks 

#### Request
- Headers
```json
{
  "access_token": "example:18721h12w1kj.dchudsasxa"
}
```

#### Response
- 200 - OK
```json
{
    "items": [
      ...
    ]
          
}
```

## `/topArtists | GET` 
- Get user's top spotify artists 

#### Request
- Headers
```json
{
  "access_token": "example:18721h12w1kj.dchudsasxa"
}
```

#### Response
- 200 - OK
```json
{
  "items": [
    ...
  ]  
}
```
 

## `/recently | GET` 
- Get user's recently listened songs informations

#### Request
- Headers
```json
{
  "access_token": "example:18721h12w1kj.dchudsasxa",
}
```

#### Response
- 200 - OK
```json

{
    "items": [
      ...
    ]
}
```

## `/findSongs | GET` 
- Add a brand new movie

#### Request
- query
```json
  ?q=shape%20of%20you
  &limit=2 //optional
```
- headers
```json
{
  "access_token": "example:18721h12w1kj.dchudsasxa",
}
```

#### Response
- 200 - OK
```json
{
    "tracks": {
      ...
    }
}
```
 
## `/topGlobal | GET` 
- Get top global songs playlist

#### Request
- headers
```json
{
  "access_token": "example:18721h12w1kj.dchudsasxa"
}
```

#### Response
- _200 - Ok_
```json
{
    "collaborative": false,
    "description": "Pembaruan harian track yang paling sering diputar saat ini - Global."
    ...
}
```

## `/subcribed | PATCH` 
- Update user's account plan status

#### Request
- headers
```json
{
  "access_token": "example:18721h12w1kj.dchudsasxa",
  "payment_token": "GYCEWGER-DHJSDBSC-SSDCDTSV"
}
```

#### Response
- 200 - OK
```json
{
  "message": "subscribed"
}

```


## `/download/:id | GET` 
- Download a song by spotify's music id 

#### Request
- headers
```json
{
  "access_token": "example:18721h12w1kj.dchudsasxa"
}
```
 

#### Response
- 200 - OK
```json
"https://api.spotifydown.com/dl/Adam%20-%20%D7%90%D7%A0%D7%99.mp3"
```



#### Response
- 201 - CREATED
```json
{
    "id": 1,
    "CustomerId": 3,
    "MovieId": 2,
    "updatedAt": "2023-02-04T14:26:44.891Z",
    "createdAt": "2023-02-04T14:26:44.891Z"
}
```

## **Global Status**
___
200 - OK

201 - CREATED


## **Global Error**
___
500 - Internal Server Error
```json
{
  "message": "Internal server error"
}
```

401 - Unauthorized
```json
{
  "message": "Unrecognized identity"
}
```
 
```json
{
    "message": "Invalid access token"
}
```
```json
{
    "message": "The access token expired"
}
```



