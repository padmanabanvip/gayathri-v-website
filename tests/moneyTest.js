import { formatCurrency } from "../scripts/utils/money.js";

console.log('test suite: formatCurrency');

console.log('convert cents to dollar')

if(formatCurrency(2095) === '20.95'){
    console.log('passed');
} else {
    console.log('failed');
}

console.log('work with zero')

if(formatCurrency(0) === '0.00'){
    console.log('passed');
} else{
    console.log('failed');
}

console.log('round up to the nearest cents and convert into doller')

if(formatCurrency(2100.57 === '2101')){
    console.log('passed');
} else{
    console.log('failed');
}