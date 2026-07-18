import pool from "../config/db.js";
import { io } from "../server.js";
export const createOrder = async (req, res) => {
  console.log("===== NEW VERSION =====");
  try {
    const {
      customerName,
      phone,
      address,
      neighborhood,
      comment,
      subtotal,
      deliveryFee,
      total,
      orderType,
      items,
    } = req.body;

    // Recherche client par téléphone

    let customerId;

    if (phone && phone.trim() !== "") {
      const customer = await pool.query(
        `
    SELECT * FROM customers
    WHERE phone = $1
    `,
        [phone],
      );

      if (customer.rows.length > 0) {
        customerId = customer.rows[0].id;
      }
    }

    if (!customerId) {
      const newCustomer = await pool.query(
        `
    INSERT INTO customers
    (
      full_name,
      phone,
      address,
      district
    )
    VALUES
    ($1,$2,$3,$4)
    RETURNING *
    `,
        [customerName, phone?.trim() ? phone : null, address, neighborhood],
      );

      customerId = newCustomer.rows[0].id;
    }

    // Génération numéro commande
    const orderNumber = "ORD-" + Date.now();

    // Création commande
    const orderResult = await pool.query(
      `
 INSERT INTO orders
(
  order_number,
  customer_id,
  subtotal,
  delivery_fee,
  total,
  status,
  comment,
  order_type
)
VALUES
($1,$2,$3,$4,$5,$6,$7,$8)
RETURNING *
  `,
      [
        orderNumber,
        customerId,
        subtotal,
        deliveryFee,
        total,
        "pending",
        comment,
        orderType,
      ],
    );

    const order = orderResult.rows[0];

    // Création order items
    // Création order items
    console.log("ITEMS =", JSON.stringify(items, null, 2));
    for (const item of items) {
      console.log("INSERTING =", item);

      await pool.query(
        `
INSERT INTO order_items
(
  order_id,
  product_id,
  quantity,
  unit_price,
  total_price,
  variant_name,
  option_name,
  crepe_steps,
  formula_name
)
VALUES
($1,$2,$3,$4,$5,$6,$7,$8,$9)
`,
        [
          order.id,
          item.productId,
          item.quantity,
          item.price,
          item.price * item.quantity,
          item.variantName,
          item.optionName,
          item.crepeSteps,
          item.formulaName,
        ],
      );
    }
    io.emit("new-order", order);
    return res.status(201).json({
      message: "Commande créée avec succès",
      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const ordersResult = await pool.query(`
      SELECT
        o.id,
        o.order_number,
        o.subtotal,
        o.delivery_fee,
        o.total,
        o.status,
        o.comment,
        o.order_type,
        o.created_at,

        c.full_name,
        c.phone,
        c.address,
        c.district

      FROM orders o
      LEFT JOIN customers c
      ON c.id = o.customer_id

      ORDER BY o.created_at DESC
    `);

    const orders = ordersResult.rows;

    for (const order of orders) {
      const itemsResult = await pool.query(
        `
  SELECT
    oi.id,
    oi.product_id,
    oi.quantity,
    oi.unit_price,
    oi.variant_name,
    oi.option_name,
    oi.crepe_steps,
    oi.formula_name,

    p.name

  FROM order_items oi
  LEFT JOIN products p
  ON p.id = oi.product_id

  WHERE oi.order_id = $1
  `,
        [order.id],
      );

      order.items = itemsResult.rows.map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.name,
        price: Number(item.unit_price),
        quantity: item.quantity,

        variant_name: item.variant_name,
        option_name: item.option_name,
        crepe_steps: item.crepe_steps,
        formula_name: item.formula_name,
      }));
    }

    return res.json(orders);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `
  UPDATE orders
  SET status = $1
  WHERE id = $2
  RETURNING *
  `,
      [status, id],
    );

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
  DELETE FROM orders
  WHERE id = $1
  `,
      [id],
    );

    return res.json({
      message: "Commande supprimée",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
