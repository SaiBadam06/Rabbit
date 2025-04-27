const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

//Helper function to get a cart by user ID or guest ID
const getCart = async (userId, guestId) => {
    if(userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};
// @route POST /api/cart
// @desc Add a product to the cart for a guest or logged in user
// @access Public

router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        //determine if the user is a guest or logged in
        let cart = await getCart(userId, guestId);

        //check id caty exists or not
        if(cart){
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if(productIndex > -1){
                //product already exists in the cart, we can update the quantity
                cart.products[productIndex].quantity += quantity;
            } else{
                //add new product to the cart
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }

            //reaclaculate the total price
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc +item.price * item.quantity,                
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        }
        else{
            //create a new cart for guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],
                totalPrice: product.price * quantity,
            });
            return res.status(201).json(newCart);
        }
}
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error });
    }
});

// @route PUT /api/cart
// @desc Get the cart for a guest or logged in user
// @access Public
router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    
    try {
        let cart = await getCart(userId, guestId);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            //product already exists in the cart, we can update the quantity
            if(quantity >0)
            {
            cart.products[productIndex].quantity = quantity;
            }
            else {
                cart.products.splice(productIndex, 1); //remove product from the cart if qty is 0
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();  
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in the cart" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error });
    }
});

// @route DELETE /api/cart
// @desc Delete a product from the cart for a guest or logged in user
// @access Public

router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    try{
        let cart = await getCart(userId, guestId);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            //product already exists in the cart, we can update the quantity
            cart.products.splice(productIndex, 1); //remove product from the cart

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in the cart" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error });
    }
});

// @route GET /api/cart
// @desc Get the cart of a logged in user
// @access Public

router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        const cart = await getCart(userId, guestId);

        if (cart) {
            res.json(cart);
        }
        else{
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error });
    } 
});

//@route POST /api/cart/merge
//@desc merge the cart of the guest with the cart of the logged in user
//@access Public
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;

    try{
    const guestCart = await Cart.findOne({guestId});
    const userCart = await Cart.findOne({user: req.user._id});

    if(guestCart){
            if(guestCart.products.length === 0){
                return res.status(404).json({ message: "Guest cart is empty" });
            }

            if(userCart){
                //merge the guest cart with the user cart
                guestCart.products.forEach((guestItems) =>
                {
                    const productIndex = userCart.products.findIndex(
                        (items) =>
                            items.productId.toString() === guestItems.productId.toString() &&
                            items.size === guestItems.size &&
                            items.color === guestItems.color
                    );

                    if(productIndex > -1){
                        //product already exists in the user cart, we can update the quantity
                        userCart.products[productIndex].quantity += guestItems.quantity;
                    }
                    else{
                        //product does not exist in the user cart, we can add it
                        userCart.products.push(guestItems);
                    }
                });

                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
                await userCart.save();

                //remove the guest cart after merging
                try{
                    await Cart.findOneAndDelete({guestId});
                }
                catch(error){
                    console.error("error deleting guest cart: ", error);
                }
                res.status(200).json(userCart);
            }
            else{
                //if user cart does not exist, we can assign guest cart to the user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();

                res.status(200).json(guestCart);
            }
        }
        else{
            if(userCart){
                //if user cart exists, we can assign guest cart to the user
                return res.status(404).json(userCart);
            }
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;