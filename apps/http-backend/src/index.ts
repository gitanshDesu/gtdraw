import app from "./app";
import { indexRouter } from "./routes/index.route";

app.use("/api/v1", indexRouter);

app.listen(4000, () => {
  console.log(`server listening on PORT: 4000`);
});
