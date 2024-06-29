import mongoose from "mongoose";
import Book from "./models/book.model.js";
mongoose.connect("mongodb+srv://learnVista:oFh8MWItuwgW1BMq@cluster0.azyyqso.mongodb.net/", {
  dbName: "learnVista",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateDocuments() {
  try {
    await Book.updateMany(
      {},
      { $set: { newField: 'defaultValue' } }, // Set a default value for the new field
      { multi: true }
    );
    console.log('Documents updated successfully');
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateDocuments();
