//import { productManagerFS } from "./dao/productManagerFS.js";
//const ProductService = new productManagerFS('products.json');
import { productManagerDB } from "./dao/productManagerDB.js";
const ProductService = new productManagerDB();

export default (io) => {
  io.on("connection", (socket) => {
    socket.on("createProduct", async (data) => {
      try {
        await ProductService.createProduct(data);
        const products = await ProductService.getAllProducts();
        socket.emit("publishProducts", products);
      } catch (error) {
        socket.emit("statusError", error.message);
      }
    });

    socket.on("deleteProduct", async (data) => {
      try {
        const result = await ProductService.deleteProduct(data.pid);
        socket.emit("publishProducts", result);
      } catch (error) {
        socket.emit("statusError", error.message);
      }
    });
  });
};