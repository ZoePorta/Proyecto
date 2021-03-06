const { getConnection } = require("../db");
const { generateError, sendEmail } = require("../helpers");

////SHOW CART
async function showCurrentOrder(req, res, next) {
  let connection;
  try {
    const { userId } = req.auth;
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT pr.id AS id, pr.name, shops_id, s.name AS shopName, category, pr.price, available, 
    type, photo, color, avg(rating) AS avgRating, COUNT(rating) AS votes
      FROM orders_products op 
      LEFT JOIN orders o ON op.orders_id=o.id 
      LEFT JOIN products pr ON op.products_id=pr.id 
    LEFT JOIN ratings r ON pr.id = r.products_id 
          LEFT JOIN shops s ON shops_id = s.id
      WHERE o.users_id=? AND finished=0 group by pr.id;
      `,
      [userId]
    );

    const [addresses] = await connection.query(
      `
      SELECT id, alias FROM addresses WHERE users_id=?;
      `,
      [userId]
    );

    res.send({
      status: "ok",
      result,
      addresses,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

////SHOW FINISHED ORDERS
async function showFinishedOrders(req, res, next) {
  let connection;
  try {
    const { userId } = req.auth;
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT o.id, sell_date, addresses_id AS address, alias, SUM(op.price) as price FROM orders o 
    LEFT JOIN orders_products op ON o.id = op.orders_id 
    LEFT JOIN addresses a ON o.addresses_id = a.id 
    WHERE o.users_id=? AND finished = 1 group by o.id 
    ORDER BY o.mod_date DESC
    `,
      [userId]
    );

    for (const order of result) {
      const [products] = await connection.query(
        `
    SELECT  pr.id AS productId, pr.name, op.price as price, photo, 
    quantity, rating from  orders_products op 
    LEFT JOIN  products pr ON op.products_id = pr.id 
    LEFT JOIN orders o ON op.orders_id = o.id
    LEFT JOIN ratings r ON op.products_id = r.products_id AND o.users_id = r.users_id
     WHERE orders_id=?;
   
    `,
        [order.id]
      );

      order.products = products;
    }

    res.send({
      status: "ok",
      result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//ADD PRODUCT TO ORDER
async function addToOrder(req, res, next) {
  let connection;
  try {
    const { userId } = req.auth;
    const { productId } = req.params;
    let { units } = req.query;
    if (!units) {
      units = 1;
    }
    connection = await getConnection();

    //Check if there is stock
    const [product] = await connection.query(
      `
    SELECT stock FROM products WHERE id=?
    `,
      [productId]
    );

    if (!product.length) {
      throw generateError(`Product not found`, 404);
    }

    const { stock } = product[0];

    if (stock < units) {
      throw generateError(`There's not enough units left.`, 409);
    }

    //Get users's active order
    let [result] = await connection.query(
      `
    SELECT id FROM orders WHERE users_id=? AND finished = 0
    `,
      [userId]
    );

    let [order] = result;
    let orderId;
    if (order) {
      orderId = order.id;
    } else {
      result = await connection.query(
        `
      INSERT INTO orders (users_id)
      VALUES(?)
      `,
        [userId]
      );

      orderId = result[0].insertId;
    }

    //Check if the product is already in the order. Add more if so.
    const [productInCart] = await connection.query(
      `
SELECT quantity FROM orders_products WHERE orders_id=? AND products_id=?
`,
      [orderId, productId]
    );

    if (productInCart.length) {
      const { quantity } = productInCart[0];
      if (stock < Number(units) + quantity) {
        throw generateError(`There's not enough units left.`, 409);
      }
      connection.query(
        `
        UPDATE orders_products SET quantity=? WHERE orders_id=? AND products_id=?
      `,
        [quantity + +units, orderId, productId]
      );
    } else {
      await connection.query(
        `
INSERT INTO orders_products (orders_id, products_id, quantity)
VALUES(?, ?, ?)
`,
        [orderId, productId, units]
      );
    }

    res.send({
      status: "ok",
      message: "Product added to cart.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//DELETE PRODUCT FROM ORDER
async function deleteFromOrder(req, res, next) {
  let connection;
  try {
    const { userId } = req.auth;
    const { productId } = req.params;

    connection = await getConnection();

    //get order ID
    const [orderResult] = await connection.query(
      `
    SELECT id FROM orders WHERE users_id=? AND finished=0
    `,
      [userId]
    );

    const [order] = orderResult;

    if (!order) {
      throw generateError(`You do not have a current order.`, 404);
    }

    //Delete product

    const [result] = await connection.query(
      `
    DELETE FROM orders_products WHERE products_id=? AND orders_id=?
    `,
      [productId, order.id]
    );

    if (!result.affectedRows) {
      throw generateError("That product was not in the cart.", 404);
    }

    res.send({
      status: "ok",
      message: "Product removed from cart.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//CHECKOUT
async function checkoutOrder(req, res, next) {
  let connection;
  try {
    const { userId } = req.auth;
    const { addressId } = req.body;

    connection = await getConnection();

    //Get current user's order
    const [order] = await connection.query(
      `
    SELECT pr.id AS productId, quantity, stock, available, pr.price AS price FROM orders o 
    LEFT JOIN orders_products op ON o.id=op.orders_id 
    LEFT JOIN products pr ON op.products_id=pr.id WHERE o.users_id=? AND finished=0;
    `,
      [userId]
    );

    if (!order.length) {
      throw generateError(`You don't have a current order.`, 404);
    }

    //Check if there is enough stock and set the current price
    for (let i = order.length - 1; i >= 0; i--) {
      const { productId, quantity, stock, price, available } = order[i];

      if (!available || stock < quantity) {
        throw generateError(
          `Some products are not available or there is not enugh stock. Remove them from your cart.`,
          409
        );
      } else {
        await connection.query(
          `
      UPDATE orders_products SET price=? WHERE products_id=?
      `,
          [price, productId]
        );
      }
    }

    //Get address info
    const [address] = await connection.query(
      `
    SELECT alias, name, row1, row2, city, country, PC, prefix, phone_number FROM addresses WHERE id=? 
    `,
      [addressId]
    );

    //Set order address
    await connection.query(
      `
    UPDATE orders SET addresses_id=? WHERE users_id=? AND finished=0
    `,
      [addressId, userId]
    );

    const totalPrice = order.reduce(
      (accumulator, currentProduct) =>
        accumulator + currentProduct.price * currentProduct.quantity,
      0
    );

    res.send({
      status: "ok",
      total: totalPrice,
      address: address[0],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function finishOrder(req, res, next) {
  let connection;
  try {
    const { userId } = req.auth;

    connection = await getConnection();

    // Get order details
    const [order] = await connection.query(
      `
    SELECT o.id AS orderId, pr.id AS productId, pr.name as productName,
    quantity, stock, u.email AS vendorEmail 
    FROM orders o 
    LEFT JOIN orders_products op ON o.id=op.orders_id 
    LEFT JOIN products pr ON op.products_id=pr.id 
    LEFT JOIN shops s ON pr.shops_id=s.id
    LEFT JOIN users u ON s.users_id = u.id
    WHERE o.users_id=? AND finished=0;
    `,
      [userId]
    );

    if (!order.length) {
      throw generateError(`Order not found.`, 404);
    }

    for (let i = order.length - 1; i >= 0; i--) {
      const { vendorEmail, productName, productId, quantity, stock } = order[i];

      //Update stock and availability

      let available = 1;

      if (stock === +quantity) {
        available = 0;
      }

      await connection.query(
        `
    UPDATE products SET stock=?, available=? WHERE id=?
    `,
        [stock - quantity, available, productId]
      );

      //Send email to vendor
      const message = `Congratulations! You have just sold ${quantity} x <a href="${process.env.FRONT_URL}/product/${productId}">${productName}</a>`;

      await sendEmail({
        email: vendorEmail,
        title: "You made a sale!",
        msgHtml: message,
      });
    }

    //Update order status
    const { orderId } = order[0];

    await connection.query(
      `
    UPDATE orders SET finished=1, sell_date=CURRENT_TIMESTAMP WHERE id=?
    `,
      [orderId]
    );

    //Send confirmation email
    const [user] = await connection.query(
      `
    SELECT  email FROM users WHERE id=?
    `,
      [userId]
    );

    const { email } = user[0];

    await sendEmail({
      email: email,
      title: "Thank you for your purchase",
      msgHtml: `Thank you! You have just made an order.`,
    });

    res.send({
      status: "ok",
      message: "Order completed.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  showCurrentOrder,
  showFinishedOrders,
  addToOrder,
  deleteFromOrder,
  checkoutOrder,
  finishOrder,
};
