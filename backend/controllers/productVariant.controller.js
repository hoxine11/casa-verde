import pool from "../config/db.js";

export const createVariant = async (req, res) => {
  try {

    const {
      product_id,
      name,
      price
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO product_variants
      (product_id,name,price)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [product_id, name, price]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getVariantsByProduct = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM product_variants
      WHERE product_id = $1
      ORDER BY id
      `,
      [req.params.productId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};