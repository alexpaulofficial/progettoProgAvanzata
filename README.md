# Progetto Programmazion Avanzata

Il progetto consiste nel realizzare un sistema che consenta di effettuare le prenotazioni di slot temporali similmente al servizio Doodle ( https://doodle.com/it/ ).

## Tabella dei contenuti

- ## Obiettivi

Lo scopo è realizzare un back-end che consenta di effettuare le prenotazioni di slot temporali similmente al servizio Doodle ( https://doodle.com/it/ ). In particolare,
il back-end deve prevedere che un utente possa effettuare chiamate (payload in JSON) per:

- **[U]** Creare un nuovo evento

- **[P]** Restituire la lista degli eventi associati all’utente distinguendo per eventi aperti e chiusi

- **[U]** Cancellare un evento se non è stata inserita alcuna preferenza

- **[U]** Chiudere un evento, ovvero non consentire più alcuna votazione.

- **[U]** Restituire le prenotazioni associate all’evento.

**[U]** corrisponde ad una rotta autenticata mediante JWT mentre **[P]** è una rotta pubblica.

Ogni utente autenticato ha un numero di token (valore iniziale impostato nel seed del database). Ad ogni creazione avvenuta con successo di un evento si deve decrementare i token associati all’utente considerando i seguenti costi:

·        1 token per Modalità 1

·        2 token per Modalità 2

·        4 token per Modalità 3

Nel caso di token terminati ogni richiesta da parte dello stesso utente deve restituire **401 Unauthorized**.

Prevedere una rotta per l’utente con ruolo admin che consenta di effettuare la ricarica per un utente fornendo la mail ed il nuovo “credito” .

# Rotte dell'applicazione

Tutte le rotte partono dall'indirizzo http://localhost:3000/api. La seguente tabella riporta tutte le rotte disponibili:

| Rotta                             | Metodo | Autenticazione JWT | Ruolo utente |
|:--------------------------------- |:------:|:------------------:|:------------:|
| /create-event                     | POST   | SI                 | qualsiasi    |
| /show-events                      | GET    | SI                 | qualsiasi    |
| /show-bookings                    | GET    | SI                 | qualsiasi    |
| */show-info-user (non richiesta)* | *GET*  | *SI*               | *admin*      |
| /close-event                      | POST   | SI                 | qualsiasi    |
| /delete-event                     | DELETE | SI                 | qualsiasi    |
| /increment-token                  | POST   | SI                 | admin        |
| /book-event                       | POST   | SI                 | qualsiasi    |

Le rotte che richiedono autenticazione JWT ricevono un token Bearer generato dalla chiave privata inserita nel file .env (di default *progettoProgAgvanzata*). Nelle descrizioni dettagliate delle rotte sono riportati il body in JSON., tralascianod il campo "email" e il campo "role" che fanno riferimento all'utente che effettua la richiesta.

###### Token JWT

```json
{
    "email":"pippo@gmail.com",
    "role":"user"
}
```

## Dettagli

ATTENZIONE! Se il body di ogni richiesta non è ben strutturato (come nei dettagli sotto) viene restituito un errore 422 "Malformed body".

#### Creazione Evento

> **POST** /create-event
> Crea un evento con owner l'utente che ha effettuato la richiesta. Se l'utente non ha token sufficienti l'evento non viene creato (errore )
> 
> ```json
> {
>     "title": "Riunione Mattutina",
>     "datetimes": [ 
>       "2023-07-11 10:00:00+01", "2023-09-15T08:00:00.000Z", "2023-09-15T10:00:00.000Z"
>     ],
>     "mode": 2,
>     "latitude": 43.52555,
>     "longitude": 13.20437,
>     "link": "https://google.it",
>     "bookings": [
>         {
>             "user": "ciccio@gmail.com",
>             "datetimes": ["2023-09-15T08:00:00.000Z"]
>         }
>     ]
> }
> ```

#### Cancellazione evento

> **DELETE** /delete-event
> Cancella un evento se la richiesta viene effettuata dall'owner e se l'evento non ha prenotazioni
> 
> ```json
> {
>   "email": "alessio@gmail.com",
>   "role": "user",
>   "event_id": 6
> }
> ```

#### Eventi di cui un utente è il creatore

> **GET** /show-events
> Visualizza tutti gli eventi di cui l'utente che sta effettuando la richiesta è il proprietario. Non è richiesto un body perchè l'utente viene preso dal token.
> 
> ```json
> {}
> ```

#### Informazioni utente (rotta non richiesta)

> **GET** /show-info-user
> Visualizza tutte le informazioni di un singolo utente. <u>Rotta accessibile solo da utente amministratore</u>
> 
> ```json
> {
>     "user":"alessio@gmail.com"
> }
> ```

#### Prenotazioni effettuate di un evento

> **GET** /show-bookings
> Visualizza tutte le prenotazioni di un singolo evento (di tutti gli utenti).
> 
> ```json
> {
>     "event_id": 3
> } 
> ```

#### Incremento token di un utente

> **POST** /increment-token
> Aumenta i token disponibili in base al numero indicato nel campo "increment_amount". E' un incremento quindi aggiunge i token inseriti a quelli già esistenti, non li sostituisce.
> 
> ```json
> {
>     "increment_amount": 20,
>     "increment_user":"alessio@gmail.com"
> } 
> ```

#### Prenotazione slot evento

> **POST** /book-event
> Prenotazione di slots di un evento. Viene controllata la modalità dell'evento e di conseguenza vengono effettuati i controlli sulla correttezza della prenotazione. Non è possibile mai avere dei doppioni e quindi prenotare due volte lo stesso slot.
> 
> ```json
> {
>     "event_id": 0,
>     "datetimes": ["2023-09-15T10:00:00.000Z"]
> }
> ```

## 📦Tool di sviluppo

- [Node.JS](https://nodejs.org)
- [Express](https://expressjs.com)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org) 
- [Docker](https://www.docker.com/)
- [Postman](https://www.postman.com)
- [JWT](https://jwt.io)
