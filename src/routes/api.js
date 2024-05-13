const express = require("express");
const brandControllers = require("../controllers/brand/brandControllers");
const categoriesController = require("../controllers/category/categoriesController");
const productControllers = require("../controllers/product/productControllers");
const UserControllers = require("../controllers/user/UserControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const wishControllers = require("../controllers/wish/wishControllers");
const cartControllers = require("../controllers/cart/cartControllers");
const invoiceController = require("../controllers/invoice/invoiceController");
const featureControllers = require("../controllers/feature/featureControllers");
const legalsController = require("../controllers/legals/legalsController");

const router = express.Router();

router.get("/status", (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

// brands
router.get("/brands", brandControllers.brandList);

// categories
router.get("/categories", categoriesController.categoryList);

// products
router.get("/productSliderList", productControllers.productSliderList);
router.get("/productListByBrand/:brandID", productControllers.productListByBrand);
router.get("/productListByCategory/:categoryID", productControllers.productListByCategory);
router.get("/productListByRemark/:remark", productControllers.productListByRemark);
router.get("/productListBySimilar/:categoryID", productControllers.productListBySimilar);
router.get("/productDetails/:productID", productControllers.productDetails);
router.get("/productListByKeyword/:keyword", productControllers.productListByKeyword);

// review
router.get("/productReviewList/:productID", productControllers.productReviewList);
router.post("/createProductReview", authMiddleware, productControllers.createProductReview);

// user
router.get("/sendOTP/:email", UserControllers.sendOTP);
router.get("/verifyOTP/:email/:otp", UserControllers.verifyOTP);
router.get("/logout", authMiddleware, UserControllers.logout);
router.post("/createProfile", authMiddleware, UserControllers.createProfile);
router.post("/updateProfile", authMiddleware, UserControllers.updateProfile);
router.get("/readProfile", authMiddleware, UserControllers.readProfile);

// wish
router.post("/saveWishList/:productID", authMiddleware, wishControllers.saveWishList);
router.delete("/removeWishList/:productID", authMiddleware, wishControllers.removeWishList);
router.get("/readWishList", authMiddleware, wishControllers.readWishList);

// cart
router.post("/saveCartList", authMiddleware, cartControllers.saveCartList);
router.delete("/removeCartList/:productID", authMiddleware, cartControllers.removeCartList);
router.put("/updateCartList", authMiddleware, cartControllers.updateCartList);
router.get("/readCartList", authMiddleware, cartControllers.readCartList);

// invoice
router.post("/createInvoice", authMiddleware, invoiceController.createInvoice);
router.get("/invoiceList", authMiddleware, invoiceController.invoiceList);
router.get("/invoiceProductList/:invoiceID", authMiddleware, invoiceController.invoiceProductList);

router.post("/paymentSuccess/:trxID", authMiddleware, invoiceController.paymentSuccess);
router.post("/paymentCancel/:trxID", authMiddleware, invoiceController.paymentCancel);
router.post("/paymentFail/:trxID", authMiddleware, invoiceController.paymentFail);
router.post("/paymentIPN/:trxID", authMiddleware, invoiceController.paymentIPN);

// features
router.get("/featureList", featureControllers.featureList);

// legals
router.get("/legalsList", legalsController.legalsList);

module.exports = router;
