var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Cart_instances, _Cart_localStorageKey, _Cart_loadFromStorage;
class Cart {
    constructor(localStorageKey) {
        _Cart_instances.add(this);
        _Cart_localStorageKey.set(this, void 0);
        __classPrivateFieldSet(this, _Cart_localStorageKey, localStorageKey, "f");
        this.cartItems = [];
        __classPrivateFieldGet(this, _Cart_instances, "m", _Cart_loadFromStorage).call(this);
    }
    saveToStorage() {
        localStorage.setItem(__classPrivateFieldGet(this, _Cart_localStorageKey, "f"), JSON.stringify(this.cartItems));
    }
    addToCart(productId) {
        let matchingItem;
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });
        if (matchingItem) {
            matchingItem.quantity += 1;
        }
        else {
            this.cartItems.push({
                productId: productId,
                quantity: 1,
                deliveryOptionId: '1'
            });
        }
        this.saveToStorage();
    }
    removeFromCart(productId) {
        const newCart = [];
        this.cartItems.forEach((cartItem) => {
            if (cartItem.productId !== productId) {
                newCart.push(cartItem);
            }
        });
        this.cartItems = newCart;
        this.saveToStorage();
    }
    updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });
        if (matchingItem) {
            matchingItem.deliveryOptionId = deliveryOptionId;
        }
        this.saveToStorage();
    }
}
_Cart_localStorageKey = new WeakMap(), _Cart_instances = new WeakSet(), _Cart_loadFromStorage = function _Cart_loadFromStorage() {
    const storedData = localStorage.getItem(__classPrivateFieldGet(this, _Cart_localStorageKey, "f"));
    this.cartItems = storedData ? JSON.parse(storedData) : [{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
            deliveryOptionId: '1'
        }, {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1,
            deliveryOptionId: '2'
        }];
};
const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');
console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);
export {};
//# sourceMappingURL=cart-class.js.map