import express, { Router } from "express";
import fileUpload from "express-fileupload";
import path from "path";

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  private readonly port: number;
  private readonly routes: Router;
  private readonly public_path: string;
  private serverListener?: any;
  public readonly app = express();
  constructor(options: Options) {
    const { port, routes, public_path = "public" } = options;
    this.port = port;
    this.routes = routes;
    this.public_path = public_path;
  }

  public start() {
    //* Middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
      })
    );

    //* Public Folder

    this.app.use(express.static(this.public_path));

    //* Routes

    this.app.use(this.routes);

    // * SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api

    this.app.get("*", (req, res) => {
      const indexPath = path.join(
        `${__dirname}/../../${this.public_path}/index.html`
      );
      res.sendFile(indexPath);
    });

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
