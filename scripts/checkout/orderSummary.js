import {cart, removeFromcart, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from ' https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';


export function renderOrderSummary(){

let cartSummaryHTML = '';

cart.forEach((CartItem) => {

    const productId = CartItem.productId;

    const matchingproduct = getProduct(productId);

    const deliveryOptionId = CartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format(
        'dddd, MMMM D'
    );


    cartSummaryHTML +=    
    `
    <div class="cart-item-container js-cart-item-container-${matchingproduct.id}">
        <div class="delivery-date">
        Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
                src="${matchingproduct.image}">

        <div class="cart-item-details">
            <div class="product-name">
            ${matchingproduct.name}
            </div>
            <div class="product-price">
            $${formatCurrency(matchingproduct.priceCents)}
            </div>
            <div class="product-quantity">
            <span>
                Quantity: <span class="quantity-label">${CartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
                Update
            </span>
            <span class="js-delete-link delete-quantity-link link-primary" data-product-id="${matchingproduct.id}";>
                Delete
            </span>
            </div>
        </div>

        <div class="delivery-options">
            <div class="delivery-options-title">
            Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingproduct, CartItem)}
            </div>
        </div>
        </div>
    </div>  
    `;
    });

    function deliveryOptionsHTML(matchingproduct, cartItem){
        let html = '';
        
        deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format(
            'dddd, MMMM D'
        );

        const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`

        const ischecked = deliveryOption.id === cartItem.deliveryOptionId;

        html +=

        ` <div class="delivery-option js-delivery-option" data-product-id="${matchingproduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" ${ischecked ? 'checked' : ''} class="delivery-option-input"
                    name="${matchingproduct.id}">
                <div>
                    <div class="delivery-option-date">
                    ${dateString}
                    </div>
                    <div class="delivery-option-price">
                    ${priceString} Shipping
                    </div>
                </div>
            </div>`
        });
        return html;
    }

    document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

    document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromcart(productId);
            const container = document.querySelector(`.js-cart-item-container-${productId}`);

            container.remove();
            renderPaymentSummary();
        });
    });
    document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
        element.addEventListener('click', () => {
            const {productId, deliveryOptionId} = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
           renderOrderSummary();
           renderPaymentSummary();
        });
    });
}
