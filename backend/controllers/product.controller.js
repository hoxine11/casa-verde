import pool from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category_id,
      is_active
    } = req.body;

    const resultImage =
      await cloudinary.uploader.upload(req.file.path);

    const imageUrl = resultImage.secure_url;

    const result = await pool.query(
      `
      INSERT INTO products
      (
        name,
        description,
        image_url,
        price,
        category_id,
        is_active
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        name,
        description,
        imageUrl,
        price,
        category_id,
        is_active
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    return res.json({
      message: "Produit supprimé",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, category_id, is_active } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET
        name = $1,
        description = $2,
        price = $3,
        category_id = $4,
        is_active = $5
      WHERE id = $6
      RETURNING *
      `,
      [name, description, price, category_id, is_active, id],
    );

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
  p.id,
  p.name,
  p.description,
  p.image_url,
  p.price,
  p.is_active,
  p.category_id,
  c.name AS category
FROM products p
LEFT JOIN categories c
ON c.id = p.category_id
ORDER BY p.id DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};
