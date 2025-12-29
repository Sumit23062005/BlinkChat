import mongoose from 'mongoose' ;

 const connectDB = async () => {
    try{
        const {MONGO_URI} = process.env ;
        if(!MONGO_URI){
            throw new Error("MONGO_URI is not defined in environment variables") ;
        }
       const conn =  await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully : " , conn.connection.host) ;

    } catch (error) {
        console.error("Error connecting to the database", error) ;
        process.exit(1) ; //1 status code indicates failure 0 indicates success 
    }
}

export default connectDB ;