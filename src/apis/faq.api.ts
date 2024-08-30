import Http from './http';

export const readCategories = (): Promise<any> => {
  return Http.get('/faq/categories');
};

export const readQuestions = (): Promise<any> => {
  return Http.get('/faq/questions');
};

export const readCategory = (categoryId: string): Promise<any> => {
  return Http.get(`/faq/categories/${categoryId}`);
};

export const readQuestion = (questionId: string): Promise<any> => {
  return Http.get(`/faq/questions/${questionId}`);
};
