import mongoose from 'mongoose';

export const connectDB = async (mongoURI) => {
  try {
   const conn = await mongoose.connect(process.env.MONGO_URI);
   console.log("MONGODB CONNECTED:" ,conn.connection.host);
 }
    catch (error) {
        console.error("MONGODB CONNECTION ERROR:", error);
        process.exit(1);
    }
         };
