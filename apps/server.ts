import app from "./app";

const PORT = 4000;

async function server() {
  app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
  });
}

server();
