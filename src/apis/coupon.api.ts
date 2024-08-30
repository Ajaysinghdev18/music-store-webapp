import Http from './http';

export const createCouponCode = (data: { discountPercentage: string }): Promise<any> => {
  return Http.post('/coupon', data);
};

export const validateCoupon = (data: {code: string}): Promise<any> => {
  return Http.post('/coupon/validate', data);
};

// export const readCategory = (categoryId: string): Promise<any> => {
//   return Http.get(`/faq/categories/${categoryId}`);
// };

// export const readQuestion = (questionId: string): Promise<any> => {
//   return Http.get(`/faq/questions/${questionId}`);
// };
