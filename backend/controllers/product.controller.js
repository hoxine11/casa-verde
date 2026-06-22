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

    const variants = JSON.parse(
      req.body.variants || "[]"
    );

    const options = JSON.parse(
      req.body.options || "[]"
    );

    let imageUrl = null;

    if (req.file) {
      const resultImage =
        await cloudinary.uploader.upload(
          req.file.path
        );

      imageUrl = resultImage.secure_url;
    }

    const productResult = await pool.query(
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
        is_active === "true",
      ]
    );

    const product = productResult.rows[0];

    // Sauvegarde des tailles
    for (const variant of variants) {
      if (!variant.name) continue;

      await pool.query(
        `
        INSERT INTO product_variants
        (
          product_id,
          name,
          price
        )
        VALUES ($1,$2,$3)
        `,
        [
          product.id,
          variant.name,
          variant.price || 0
        ]
      );
    }

    // Sauvegarde des options
    for (const option of options) {
      if (!option.name) continue;

      await pool.query(
        `
        INSERT INTO product_options
        (
          product_id,
          name,
          price
        )
        VALUES ($1,$2,$3)
        `,
        [
          product.id,
          option.name,
          option.price || 0
        ]
      );
    }

    return res.status(201).json({
      message: "Produit créé avec succès",
      product
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
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

    const {
      name,
      description,
      price,
      category_id,
      is_active
    } = req.body;

    const variants = JSON.parse(
      req.body.variants || "[]"
    );

    const options = JSON.parse(
      req.body.options || "[]"
    );

    await pool.query(
      `
      UPDATE products
      SET
        name = $1,
        description = $2,
        price = $3,
        category_id = $4,
        is_active = $5
      WHERE id = $6
      `,
      [
        name,
        description,
        price,
        category_id,
        is_active === "true",
        id
      ]
    );

    // حذف الأحجام القديمة
    await pool.query(
      `
      DELETE FROM product_variants
      WHERE product_id = $1
      `,
      [id]
    );

    // إعادة إدخال الأحجام الجديدة
    for (const variant of variants) {
      if (!variant.name) continue;

      await pool.query(
        `
        INSERT INTO product_variants
        (
          product_id,
          name,
          price
        )
        VALUES ($1,$2,$3)
        `,
        [
          id,
          variant.name,
          variant.price || 0
        ]
      );
    }

    // حذف الخيارات القديمة
    await pool.query(
      `
      DELETE FROM product_options
      WHERE product_id = $1
      `,
      [id]
    );

    // إعادة إدخال الخيارات الجديدة
    for (const option of options) {
      if (!option.name) continue;

      await pool.query(
        `
        INSERT INTO product_options
        (
          product_id,
          name,
          price
        )
        VALUES ($1,$2,$3)
        `,
        [
          id,
          option.name,
          option.price || 0
        ]
      );
    }

    return res.json({
      message: "Produit modifié avec succès"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
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
  c.name AS category,

  COALESCE(
    (
      SELECT json_agg(v)
      FROM product_variants v
      WHERE v.product_id = p.id
    ),
    '[]'
  ) AS variants,

  COALESCE(
    (
      SELECT json_agg(o)
      FROM product_options o
      WHERE o.product_id = p.id
    ),
    '[]'
  ) AS options

FROM products p
LEFT JOIN categories c
ON c.id = p.category_id

ORDER BY p.id DESC
`);

    res.status(200).json(result.rows);
  } catch (error) {
  console.error(error);

  res.status(500).json({
    error: error.message,
    detail: error
  });
}
};
