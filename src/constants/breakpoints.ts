
export const breakPoints = {
$4k: 2560,
$3k:2050,
$laptopl:1440,
$laptopm:1400,
$laptop:1024,
$tablet:768,
$mobilel:425,
$mobilemd:375,
$mobilesm:320,
}
export const getProductRowNumber = (width: any) => {
let productsPerRow = 6
    if (width > breakPoints.$3k && width <= breakPoints.$4k ) {
      productsPerRow = 6
    } 
    else if(width > breakPoints.$laptopl && width <= breakPoints.$3k ) {
      productsPerRow = 4
    }else if (width > breakPoints.$laptopm && width <= breakPoints.$laptopl) {
      productsPerRow = 4
    }else if (width > breakPoints.$laptop && width <= breakPoints.$laptopm) {
      productsPerRow = 3
    } else if (width > breakPoints.$tablet && width <= breakPoints.$laptop) {
      productsPerRow = 3
    } else if (width > breakPoints.$mobilel && width <= breakPoints.$tablet) {
      productsPerRow = 3
    } else if (width > breakPoints.$mobilemd && width <= breakPoints.$mobilel) {
      productsPerRow = 2
    } else if (width > breakPoints.$mobilesm && width <= breakPoints.$mobilemd) {
      productsPerRow = 2
    } else if (width <= breakPoints.$mobilesm) {
      productsPerRow = 2
    }
    return productsPerRow
}
