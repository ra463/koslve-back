# WUE - Ksolves

Tech Stack Used:-

```
Nodejs & Express - In Backend

MongoDB - For Database

Cloudinary - For Storing Videos & Images
```

### Server Deployed Link - [https://ksolve-app.adaptable.app]

### Client Deployed Link - [https://ksolve-front-aibe.vercel.app]

## Setup Instructions

1. Clone the repository - `https://github.com/ra463/koslve-back.git`
2. Install dependencies using `npm install`.
3. Create the `config.env` in the config folder like this - `/config/config.env`.
4. Configure environment variables:
   - `JWT_SECRET`
   - `JWT_EXPIRE` [Eg - 2D]
   - `CLOUDINARY_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `MONGO_URI`
   - `PORT`
5. Add the client url (local/deployed) in the `cors` in `app.js` file.
6. Start the server using `npm run dev` (if nodemon is globally installed).

To run this project simply run the command `npm run dev`