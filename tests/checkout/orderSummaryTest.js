import { renderOrderSummary } from '../../scripts/checkout/orderSummary.js';
import { loadFromStorage, cart } from '../../data/cart.js';
import { loadProductsFetch } from '../../data/products.js';
describe('test suite: renderOrderSummary', () => {
    const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
    const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';
    beforeAll((done) => {
        loadProductsFetch().then(() => {
            done();
        });
    });
    beforeEach(() => {
        spyOn(localStorage, 'setItem');
        const testContainer = document.querySelector('.js-test-container');
        if (testContainer) {
            testContainer.innerHTML = `
        <div class="js-order-summary"></div>
        <div class="js-payment-summary"></div>
      `;
        }
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                    productId: productId1,
                    quantity: 2,
                    deliveryOptionId: '1'
                }, {
                    productId: productId2,
                    quantity: 1,
                    deliveryOptionId: '2'
                }]);
        });
        loadFromStorage();
        renderOrderSummary();
    });
    it('displays the cart', () => {
        expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
        const productQuantity1 = document.querySelector(`.js-product-quantity-${productId1}`);
        if (productQuantity1) {
            expect(productQuantity1.textContent).toContain('Quantity: 2');
        }
        const productQuantity2 = document.querySelector(`.js-product-quantity-${productId2}`);
        if (productQuantity2) {
            expect(productQuantity2.textContent).toContain('Quantity: 1');
        }
        const testContainer = document.querySelector('.js-test-container');
        if (testContainer) {
            testContainer.innerHTML = '';
        }
    });
    it('removes a product', () => {
        const deleteLink = document.querySelector(`.js-delete-link-${productId1}`);
        if (deleteLink) {
            deleteLink.click();
        }
        expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
        expect(document.querySelector(`.js-cart-item-container-${productId1}`)).toEqual(null);
        expect(document.querySelector(`.js-cart-item-container-${productId2}`)).not.toEqual(null);
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual(productId2);
        const testContainer = document.querySelector('.js-test-container');
        if (testContainer) {
            testContainer.innerHTML = '';
        }
    });
});
//# sourceMappingURL=orderSummaryTest.js.map