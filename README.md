# Digital Store - E-commerce Web Application

A complete e-commerce web application built with HTML, Tailwind CSS, JavaScript, Node.js, Express, MongoDB, and Dodo Payments integration.

## Features

### Frontend Features
- **Home Page**: Landing page with hero section and features
- **Product Listing**: Browse all available digital products
- **Product Detail**: Detailed view of individual products
- **Checkout**: Complete purchase flow with Dodo Payments integration
- **Thank You Page**: Download links after successful purchase
- **Privacy Policy & Terms**: Legal pages

### Admin Panel Features
- **Admin Login**: Secure authentication for admin access
- **Dashboard**: Overview of orders, revenue, products, and coupons
- **Product Management**: Add, edit, delete digital products with file uploads
- **Order Management**: View and manage customer orders
- **Coupon Management**: Create, activate/deactivate discount coupons
- **Customer Details**: View customer information and purchase history

### Backend Features
- **RESTful API**: Complete API for all operations
- **MongoDB Integration**: Data persistence with Mongoose ODM
- **Dodo Payments**: Secure global and local payment processing (Cards, UPI, RuPay, etc.)
- **File Upload**: Handle product images and digital files
- **Email Integration**: Send download links after purchase
- **Authentication**: JWT-based admin authentication
- **Coupon System**: Discount code functionality

## Technology Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Payment**: Dodo Payments (UPI, Cards, International)
- **Email**: Nodemailer
- **Authentication**: JWT, bcryptjs
- **File Upload**: Multer

## Project Structure

```
e-commerce-project/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Coupon.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── coupons.js
│   │   └── payment.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── product-detail.html
│   ├── checkout.html
│   ├── thank-you.html
│   ├── privacy.html
│   ├── terms.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── admin-products.html
│   ├── admin-orders.html
│   ├── admin-coupons.html
│   └── admin-customers.html
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Dodo Payments account for payment integration

### 1. Clone/Download the Project
```bash
# If using git
git clone <repository-url>
cd e-commerce-project

# Or extract the downloaded ZIP file
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/digitalstore

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Dodo Payments Configuration
DODO_PAYMENTS_API_KEY=your_dodo_api_key_here
DODO_PAYMENTS_WEBHOOK_KEY=your_dodo_webhook_key_here
DODO_PAYMENTS_ENVIRONMENT=test_mode
DODO_PRODUCT_ID=your_dodo_product_id_optional
BASE_URL=http://localhost:3000

# Email Configuration (for sending download links)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
```

### 4. Start MongoDB
```bash
# On Ubuntu/Linux
sudo systemctl start mongod

# On macOS with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB
```

### 5. Start the Backend Server
```bash
cd backend
node server.js
```

The server will start on `http://localhost:5000`

### 6. Create Default Admin User
```bash
curl -X POST http://localhost:5000/api/auth/create-admin -H "Content-Type: application/json"
```

### 7. Access the Application
- **Frontend**: Open `frontend/index.html` in your browser
- **Admin Panel**: Navigate to admin login and use:
  - Username: `narendra`
  - Password: `narendra`

## Configuration Details

### Dodo Payments Setup
1. Sign up at [Dodo Payments](https://test.dodopayments.com/) (Test mode) or [Dodo Live](https://app.dodopayments.com/)
2. Generate an API Key under **Developer / API Keys** and add as `DODO_PAYMENTS_API_KEY`
3. Add a Webhook under **Developer / Webhooks** pointing to `https://<your-domain>/api/payment/webhook` with `payment.succeeded` & `payment.failed` events
4. Add the Webhook Secret as `DODO_PAYMENTS_WEBHOOK_KEY`
5. (Optional) Create a product with "Pay What You Want" enabled and put its ID in `DODO_PRODUCT_ID`

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Use your Gmail address and app password in `.env`

### MongoDB Setup
- Default connection: `mongodb://localhost:27017/digitalstore`
- For MongoDB Atlas (cloud), replace with your connection string

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/create-admin` - Create default admin

### Products
- `GET /api/products` - Get all active products
- `GET /api/products/admin/all` - Get all products (admin)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create new order
- `POST /api/orders/:id/resend-download` - Resend download link (admin)

### Coupons
- `GET /api/coupons` - Get all coupons (admin)
- `POST /api/coupons` - Create coupon (admin)
- `POST /api/coupons/apply` - Apply coupon
- `PUT /api/coupons/:id/status` - Update coupon status (admin)
- `DELETE /api/coupons/:id` - Delete coupon (admin)

### Payment
- `POST /api/payment/create-order` - Create Dodo Payments checkout session
- `POST /api/payment/webhook` - Dodo Payments webhook handler
- `GET /api/payment/status/:orderId` - Check payment status

## Usage Guide

### For Customers
1. Browse products on the homepage
2. Click on products to view details
3. Proceed to checkout
4. Apply coupon codes if available
5. Complete payment via Dodo Payments (Hosted Checkout)
6. Receive download link via email

### For Admins
1. Login to admin panel
2. **Dashboard**: View overview statistics
3. **Products**: Add/edit digital products with files
4. **Orders**: Monitor customer orders
5. **Coupons**: Create discount codes
6. **Customers**: View customer details and history

## Testing the Application

### Test Coupon Creation
1. Login to admin panel
2. Go to Coupons section
3. Create a new coupon (e.g., SAVE20 for 20% off)
4. Test applying it during checkout

### Test Product Management
1. Go to Products section in admin
2. Add a new product with image and digital file
3. Verify it appears on the frontend

### Test Payment Flow
1. Use Dodo Payments test mode (`DODO_PAYMENTS_ENVIRONMENT=test_mode`)
2. Test payment using Dodo test cards or test UPI
3. Complete checkout and check instant redirect to thank you page with download link

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Dodo Payment Fails**
   - Verify `DODO_PAYMENTS_API_KEY` is correct in `.env`
   - Check if environment is set to `test_mode` or `live_mode`
   - Ensure webhook endpoint is reachable

3. **File Upload Issues**
   - Ensure `uploads` directory exists
   - Check file permissions

4. **Email Not Sending**
   - Verify Gmail app password
   - Check email configuration

### Logs and Debugging
- Backend logs appear in the terminal
- Check browser console for frontend errors
- MongoDB logs: `sudo journalctl -u mongod`

## Security Considerations

- Change default admin credentials
- Use strong JWT secret
- Keep Dodo Payments API keys and webhook secrets secure
- Use HTTPS in production
- Validate file uploads
- Sanitize user inputs

## Production Deployment

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas for database
3. Deploy backend to services like Heroku, DigitalOcean
4. Serve frontend via CDN or static hosting
5. Configure proper CORS settings
6. Use environment-specific configurations

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check MongoDB and Node.js logs
4. Verify environment configuration

## License

This project is created for educational/commercial purposes. Modify as needed for your requirements.

---

**Default Admin Credentials:**
- Username: `narendra`
- Password: `narendra`

**Note**: Change these credentials in production!








// Serve frontend files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});