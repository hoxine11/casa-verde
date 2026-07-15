export const printOrder = (order: any) => {
  const printWindow = window.open("", "_blank", "width=400,height=700");

  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Commande #${order.id}</title>

      <style>
        @page{
    size:80mm auto;
    margin:0;
}

        *{
          box-sizing:border-box;
        }

        html{
          width:80mm;
          margin:0;
          padding:0;
        }

        body{
          font-family: Arial, sans-serif;
          width:80mm;
          margin:0;
          padding:5mm;
          color:#000;
        }

        .center{
          text-align:center;
        }

        .logo{
          width:120px;
          margin-bottom:8px;
        }

        .restaurant{
          font-size:22px;
          font-weight:bold;
        }

        .line{
          border-top:1px dashed #000;
          margin:10px 0;
        }

        .row{
          display:flex;
          justify-content:space-between;
          margin:4px 0;
        }

        .total{
          font-size:18px;
          font-weight:bold;
        }

        .small{
          font-size:12px;
        }

        @media print{
          @page{
            margin:0;
          }

          html,
          body{
            width:80mm;
            margin:0;
            padding:0;
          }

         .ticket{
    width:72mm;
    margin:auto;
    padding:3mm;
}

          button{
            display:none;
          }
        }
      </style>
    </head>

    <body>
      <div class="ticket">

      <div class="center">

        <img
          class="logo"
          src="/logo.jpg"
        />

        <div class="restaurant">
          CASA VERDE
        </div>

        <div class="small">
          Crêperie & Fast Food
        </div>

        <div class="small">
          Tel : +213 555 12 34 56
        </div>

      </div>

      <div class="line"></div>

      <div>
        <strong>Commande :</strong>
        #${order.id}
      </div>

      <div>
        <strong>Date :</strong>
        ${order.date}
      </div>

      <div>
        <strong>Client :</strong>
        ${order.customerName}
      </div>

      <div>
        <strong>Tel :</strong>
        ${order.phone}
      </div>

      <div>
        <strong>Adresse :</strong>
        ${order.address}
      </div>

      <div class="line"></div>

      ${order.items
        .map(
          (item: any) => `
        <div class="row">
          <span>
            ${item.quantity} x ${item.product_name || item.name}
          </span>

          <span>
            ${(item.price * item.quantity).toFixed(0)} DA
          </span>
        </div>
      `,
        )
        .join("")}

      <div class="line"></div>

      <div class="row">
        <span>Sous Total</span>
        <span>${order.subtotal} DA</span>
      </div>

      <div class="row">
        <span>Livraison</span>
        <span>${order.deliveryFee} DA</span>
      </div>

      <div class="line"></div>

      <div class="row total">
        <span>TOTAL</span>
        <span>${order.total} DA</span>
      </div>

      <div class="line"></div>

      <div class="center small">
        Merci pour votre confiance
      </div>

      </div>

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
            window.close();
          }, 100);
        }
      </script>

    </body>
    </html>
  `);

  printWindow.document.close();
};
