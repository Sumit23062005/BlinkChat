import express from 'express' ;
import cookieParser from 'cookie-parser' ;
import authRoutes from './routes/auth.route.js' ;
import messageRoutes from './routes/message.route.js' ;
import path from 'path' ; 
import cors from 'cors' ;
import connectDB from './lib/db.js' ;
import {ENV} from './lib/env.js' ;
import{ app , server} from './lib/socket.js'  ;
const __dirname = path.resolve() ;
const PORT = ENV.PORT || 3000;

app.use(express.json({ limit : "5mb" }) ) ; // to parse json request body
app.use(express.urlencoded({extended : true})) ; // to parse urlencoded request body
app.use(cors({origin : ENV.CLIENT_URL , credentials : true })) ; // enable CORS for frontend origin
app.use(cookieParser()) ;

app.use("/api/auth" , authRoutes)
app.use("/api/messages" , messageRoutes) ;


// make ready for deployment 
if(ENV.NODE_ENV === 'production' ) {
    app.use(express.static(path.join(__dirname, '../frontend/dist'))) ;

    app.get("*", (_,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}` ) ;
     connectDB() ;
})
