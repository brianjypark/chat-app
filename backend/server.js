const express = require("express");
const dotenv = require("dotenv");
const connectToDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectToDB();

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  response.send("API is running");
});

app.use("/api/user", userRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
