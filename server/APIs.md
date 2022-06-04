## APIs

### __List all the films__

URL: `/api/films`

HTTP Method: GET

Description: Get all the films that the student already passed.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "code": "01abc",
    "name": "Web Applications I",
    "credits": 6,
    "score": 30,
    "laude": true,
    "date": "2022-06-03"
  },
  {
    "code": "02def",
    "name": "How to pass films",
    "credits": 3,
    "score": 18,
    "laude": false,
    "date": "2021-09-15"
  },
  ...
]
```

### __Create a new film__

URL: `/api/films`

HTTP Method: POST

Description: Add a new passed film.

Request body:
```
{
  "code": "01abc",
  "score": 30,
  "laude": true,
  "date": "2022-06-03"
}
```

Response: `201 Created` (success) or `503 Service Unavailable` (generic error) or `422 Unprocessable Entity`.

Response body: _None_.

### __Update a film__

URL: `/api/films/<code>`

HTTP Method: PUT

Description: Update some information of an film.

filmple: `/api/films/01abc`

Request body:
```
{
  "code": "01abc",
  "score": 30,
  "laude": true,
  "date": "2022-06-03"
}
```

Response: `200 OK` (success) or `503 Service Unavailable` (generic error) or `422 Unprocessable Entity`.

Response body: _None_.

### __Mark film as favorite/unfavorite__

URL: `/api/films/<code>`

HTTP Method: PUT

Description: Update some information of an film.

filmple: `/api/films/:code`

Request body:
```
{
  "favorite": true,
}
```

Response: `200 OK` (success) or `503 Service Unavailable` (generic error) or `422 Unprocessable Entity`.

Response body: _None_.

### __Delete an existing film__

URL: `/api/films/<code>`

HTTP Method: DELETE

Description: Delete a passed film given its code.

filmple: `/api/films/`

Request body: _None_.

Response: `204` (success) or `503 Service Unavailable` (generic error) or `404`.

Response body: _None_.