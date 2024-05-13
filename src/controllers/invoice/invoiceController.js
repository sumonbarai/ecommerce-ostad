/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable dot-notation */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const { default: mongoose } = require("mongoose");
const FormData = require("form-data");
const { default: axios } = require("axios");
const CartModel = require("../../models/Cart/CartModel");
const cartListService = require("../../services/cartListService");
const InvoiceModel = require("../../models/Invoice/InvoiceModel");
const ProfileModel = require("../../models/User/ProfileModel");
const readProfileService = require("../../services/readProfileService");
const createTransactionID = require("../../utilities/createTransactionID");
const customError = require("../../utilities/customError");
const InvoiceProductModel = require("../../models/Invoice/InvoiceProductModel");
const PaymentSettingModel = require("../../models/PamentSetting/PamentSettingModel");
const findService = require("../../services/findService");
const listService = require("../../services/listService");

const createInvoice = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const userEmail = req.headers.email;
    const matchQuery = { userID: new mongoose.Types.ObjectId(userID) };
    const cartProduct = await cartListService(CartModel, matchQuery);

    // checking cart is empty
    if (!cartProduct.length > 0) {
      throw customError("cart is empty, please insert a product in cart", 400);
    }

    // calculate total amount and vat
    let totalAmount = 0;

    cartProduct.forEach((item) => {
      const { qty } = item;
      const price = item.product.discount
        ? item.product.discountPrice
        : item.product.price;
      totalAmount = parseFloat(price) * parseFloat(qty);
    });

    const vat = totalAmount * 0.15;
    const payable = totalAmount + vat;

    // get user profile
    const UserProfile = await readProfileService(ProfileModel, matchQuery);
    const {
      cus_name,
      cus_add,
      cus_country,
      cus_phone,
      ship_name,
      ship_add,
      ship_country,
      ship_phone,
    } = UserProfile[0];

    const cus_details = `${cus_name}, ${cus_add}, ${cus_country}, ${cus_phone}`;

    const ship_details = `${ship_name}, ${ship_add}, ${ship_country}, ${ship_phone}`;

    // create transaction id val_id
    const tran_id = createTransactionID();
    const val_id = 0;
    const payment_status = "pending";
    const delivery_status = "pending";

    // create a invoice
    const invoice = await InvoiceModel.create({
      userID,
      payable,
      cus_details,
      ship_details,
      tran_id,
      val_id,
      payment_status,
      delivery_status,
      total: totalAmount,
      vat,
    });

    // create invoice product
    const insertDoc = [];
    cartProduct.forEach((item) => {
      const { qty, product, color, size, productID } = item;
      const price = product.discount ? product.discountPrice : product.price;
      const temp = {
        userID,
        productID,
        invoiceID: invoice._id,
        qty,
        price,
        color,
        size,
      };

      insertDoc.push(temp);
    });
    await InvoiceProductModel.insertMany(insertDoc);

    // clean cart list
    await CartModel.deleteMany({ userID });

    // ============= Prepare SSL Payment

    const PaymentSettings = await PaymentSettingModel.find();

    const form = new FormData();
    form.append("store_id", PaymentSettings[0]["store_id"]);
    form.append("store_passwd", PaymentSettings[0]["store_passwd"]);
    form.append("total_amount", payable.toString());
    form.append("currency", PaymentSettings[0]["currency"]);
    form.append("tran_id", tran_id);

    form.append(
      "success_url",
      `${PaymentSettings[0]["success_url"]}/${tran_id}`
    );
    form.append("fail_url", `${PaymentSettings[0]["fail_url"]}/${tran_id}`);
    form.append("cancel_url", `${PaymentSettings[0]["cancel_url"]}/${tran_id}`);
    form.append("ipn_url", `${PaymentSettings[0]["ipn_url"]}/${tran_id}`);

    form.append("cus_name", UserProfile[0]["cus_name"]);
    form.append("cus_email", userEmail);
    form.append("cus_add1", UserProfile[0]["cus_add"]);
    form.append("cus_add2", UserProfile[0]["cus_add"]);
    form.append("cus_city", UserProfile[0]["cus_city"]);
    form.append("cus_state", UserProfile[0]["cus_state"]);
    form.append("cus_postcode", UserProfile[0]["cus_postcode"]);
    form.append("cus_country", UserProfile[0]["cus_country"]);
    form.append("cus_phone", UserProfile[0]["cus_phone"]);
    form.append("cus_fax", UserProfile[0]["cus_phone"]);

    form.append("shipping_method", "YES");
    form.append("ship_name", UserProfile[0]["ship_name"]);
    form.append("ship_add1", UserProfile[0]["ship_add"]);
    form.append("ship_add2", UserProfile[0]["ship_add"]);
    form.append("ship_city", UserProfile[0]["ship_city"]);
    form.append("ship_state", UserProfile[0]["ship_state"]);
    form.append("ship_country", UserProfile[0]["ship_country"]);
    form.append("ship_postcode", UserProfile[0]["ship_postcode"]);

    form.append("product_name", "According Invoice");
    form.append("product_category", "According Invoice");
    form.append("product_profile", "According Invoice");
    form.append("product_amount", "According Invoice");

    const SSLRes = await axios.post(PaymentSettings[0]["init_url"], form);

    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success ",
      data: SSLRes.data,
    });
  } catch (error) {
    next(error);
  }
};

const invoiceList = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const matchQuery = { userID };
    const result = await listService(InvoiceModel, matchQuery);

    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success ",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const invoiceProductList = async (req, res, next) => {
  try {
    const userID = req.headers._id;
    const { invoiceID } = req.params;
    const matchQuery = { userID, invoiceID };
    const result = await listService(InvoiceProductModel, matchQuery);

    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success ",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const paymentSuccess = async (req, res, next) => {
  try {
    const { trxID } = req.params;
    const userID = req.headers._id;
    const matchQuery = { userID, tran_id: trxID };
    const result = await findService(InvoiceModel, matchQuery);

    if (!result) {
      throw customError("invalid transaction id", 400);
    }
    result.payment_status = "success";
    await result.save();
    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success ",
    });
  } catch (error) {
    next(error);
  }
};

const paymentCancel = async (req, res, next) => {
  try {
    const { trxID } = req.params;
    const userID = req.headers._id;
    const matchQuery = { userID, tran_id: trxID };
    const result = await findService(InvoiceModel, matchQuery);

    if (!result) {
      throw customError("invalid transaction id", 400);
    }
    result.payment_status = "cancel";
    await result.save();
    // everything is ok now send success response to client
    res.status(200).json({
      msg: "cancel ",
    });
  } catch (error) {
    next(error);
  }
};

const paymentFail = async (req, res, next) => {
  try {
    const { trxID } = req.params;
    const userID = req.headers._id;
    const matchQuery = { userID, tran_id: trxID };
    const result = await findService(InvoiceModel, matchQuery);

    if (!result) {
      throw customError("invalid transaction id", 400);
    }
    result.payment_status = "fail";
    await result.save();
    // everything is ok now send success response to client
    res.status(200).json({
      msg: "fail ",
    });
  } catch (error) {
    next(error);
  }
};

const paymentIPN = async (req, res, next) => {
  try {
    const { trxID } = req.params;
    const userID = req.headers._id;
    const { status } = req.body;
    const matchQuery = { userID, tran_id: trxID };
    const result = await findService(InvoiceModel, matchQuery);

    if (!result) {
      throw customError("invalid transaction id", 400);
    }
    result.payment_status = status;
    await result.save();
    // everything is ok now send success response to client
    res.status(200).json({
      msg: "success ",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  paymentSuccess,
  paymentCancel,
  paymentFail,
  paymentIPN,
  invoiceList,
  invoiceProductList,
};
