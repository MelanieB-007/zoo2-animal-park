import mongoose from "mongoose";

const { Schema } = mongoose;

const animalSchema = new Schema({
   name: { type: String, required: true },
});

const Animal = mongoose.models.Animal || mongoose.model("Animal", animalSchema);

export default Animal;