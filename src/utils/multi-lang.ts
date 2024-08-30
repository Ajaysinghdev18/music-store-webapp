import { IMultiLanguage, IMultiLanguageType } from '../shared/interfaces';

export const displayTranslation = (word: IMultiLanguage, lang: IMultiLanguageType ) => {
    const ret = word[lang] 
    //  || word.en || word.nl || word.de || word.fr || word.es;
    if (ret) return ret;
    return '';
};
